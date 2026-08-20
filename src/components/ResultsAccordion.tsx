"use client";

import { useState } from "react";
import { Program, Result, Student, Team } from "@/types";
import { Award, Lock, ChevronDown, Trophy, Medal, Sparkles, ArrowLeft, X, Search } from "lucide-react";
import confetti from "canvas-confetti";
import { StudentAvatar } from "./Leaderboard";
import { StudentPointsModal } from "./StudentPointsModal";

interface ResultsAccordionProps {
  programs: Program[];
  results: Result[];
  students: Student[];
  teams: Team[];
  showAllPrograms?: boolean;
  setShowAllPrograms?: (show: boolean) => void;
  expandedProgramId?: string | null;
  setExpandedProgramId?: (id: string | null) => void;
}

export function ResultsAccordion({
  programs,
  results,
  students,
  teams,
  showAllPrograms: parentShowAllPrograms,
  setShowAllPrograms: parentSetShowAllPrograms,
  expandedProgramId: parentExpandedProgramId,
  setExpandedProgramId: parentSetExpandedProgramId,
}: ResultsAccordionProps) {
  const [selectedPopupStudent, setSelectedPopupStudent] = useState<Student | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [localExpandedProgramId, setLocalExpandedProgramId] = useState<string | null>(null);
  const [localShowAllPrograms, setLocalShowAllPrograms] = useState<boolean>(false);

  const showAllPrograms = parentShowAllPrograms !== undefined ? parentShowAllPrograms : localShowAllPrograms;
  const setShowAllPrograms = parentSetShowAllPrograms || setLocalShowAllPrograms;

  const expandedProgramId = parentExpandedProgramId !== undefined ? parentExpandedProgramId : localExpandedProgramId;
  const setExpandedProgramId = parentSetExpandedProgramId || setLocalExpandedProgramId;

  const categories = [
    "All",
    "Revealed",
    "General",
    "Sanaviyya",
    "Bakalooriyya",
    "Stage",
    "Off-Stage",
  ];

  const revealedCount = programs.filter((p) => p.is_revealed).length;

  const filteredPrograms = programs.filter((p) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Revealed" || selectedCategory === "Published") {
      return p.is_revealed;
    }
    if (selectedCategory === "General") {
      return p.category === "General" || p.grade === "General" || p.id.startsWith("gen-");
    }
    if (selectedCategory === "Sanaviyya") {
      return (
        p.grade === "Sanaviyya" ||
        p.grade === "A" ||
        p.name.includes("Sanaviyya") ||
        p.name.includes("Bracket A") ||
        p.id.startsWith("san-")
      );
    }
    if (selectedCategory === "Bakalooriyya" || selectedCategory === "Bakalooria") {
      return (
        p.grade === "Bakalooriyya" ||
        p.grade === "Bakalooria" ||
        p.grade === "B" ||
        p.name.includes("Bakalooriyya") ||
        p.name.includes("Bakalooria") ||
        p.name.includes("Bracket B") ||
        p.id.startsWith("bak-")
      );
    }
    return p.category === selectedCategory;
  });

  // Apply search filter on top of category filter
  const searchFilteredPrograms = programSearchQuery.trim() === ""
    ? filteredPrograms
    : filteredPrograms.filter((p) =>
        p.name.toLowerCase().includes(programSearchQuery.toLowerCase().trim())
      );

  // Sort programs so newly revealed/updated programs appear FIRST at the top!
  const sortedPrograms = [...searchFilteredPrograms].sort((a, b) => {
    if (a.is_revealed !== b.is_revealed) {
      return a.is_revealed ? -1 : 1;
    }
    const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return timeB - timeA;
  });

  // ALL revealed/published programs must ALWAYS be displayed in full every time!
  // No revealed program will ever be hidden or automatically removed after some time.
  const revealedProgramsList = sortedPrograms.filter((p) => p.is_revealed);
  const pendingProgramsList = sortedPrograms.filter((p) => !p.is_revealed);

  const displayedPrograms = showAllPrograms
    ? sortedPrograms
    : [
        ...revealedProgramsList,
        ...pendingProgramsList.slice(0, Math.max(0, 6 - Math.min(6, revealedProgramsList.length))),
      ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#1A56DB", "#F59E0B", "#EF4444", "#22C55E"],
    });
  };

  const toggleExpand = (program: Program) => {
    if (!program.is_revealed) return;
    if (expandedProgramId === program.id) {
      setExpandedProgramId(null);
    } else {
      setExpandedProgramId(program.id);
      triggerConfetti();
    }
  };

  return (
    <section
      id="results"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Section Header */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 14px",
            borderRadius: 99,
            background: "#E8EFFF",
            color: "#1A56DB",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          <Award className="w-3.5 h-3.5" />
          Suspense & Stage Winners
        </div>
        <h2
          style={{
            fontWeight: 900,
            fontSize: "clamp(24px,4.5vw,38px)",
            color: "#111827",
            letterSpacing: "-0.5px",
          }}
        >
          Programs & Results
        </h2>
      </div>

      {/* Category / Bracket Filter Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`filter-chip${selectedCategory === cat ? " active" : ""}`}
            style={
              cat === "Revealed" && selectedCategory !== "Revealed"
                ? { background: "#ECFDF5", color: "#059669", borderColor: "#A7F3D0" }
                : undefined
            }
          >
            {cat === "Revealed" ? `✨ Revealed (${revealedCount})` : cat}
          </button>
        ))}
      </div>

      {/* Program Search Bar */}
      <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Search className="w-4 h-4" style={{ color: "#9CA3AF" }} />
        </div>
        <input
          type="text"
          placeholder="Search programs..."
          value={programSearchQuery}
          onChange={(e) => setProgramSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 38px 10px 40px",
            borderRadius: 14,
            background: "#FFFFFF",
            border: "1.5px solid #E4EAF4",
            color: "#111827",
            fontSize: 13,
            fontWeight: 600,
            outline: "none",
            boxShadow: "0 2px 8px rgba(30, 64, 175, 0.06)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#1A56DB";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26, 86, 219, 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E4EAF4";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(30, 64, 175, 0.06)";
          }}
        />
        {programSearchQuery.trim() !== "" && (
          <button
            onClick={() => setProgramSearchQuery("")}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#F3F4F6",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
              cursor: "pointer",
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Programs Accordion */}
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {showAllPrograms && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <button
              onClick={() => {
                setShowAllPrograms(false);
                document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 14px",
                borderRadius: 99,
                background: "linear-gradient(135deg, #FFFDF0 0%, #FEF3C7 100%)",
                color: "#78350F",
                fontSize: 11,
                fontWeight: 800,
                border: "1.5px solid #FCD34D",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(180, 83, 9, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FEF3C7";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FFFDF0 0%, #FEF3C7 100%)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <X className="w-3.5 h-3.5" style={{ color: "#78350F" }} />
              <span>Close (Back to 6)</span>
            </button>
          </div>
        )}

        {filteredPrograms.length > 0 ? (
          <>
            {displayedPrograms.map((prog) => {
              const isExpanded = expandedProgramId === prog.id;
              const progResults = results
                .filter((r) => r.program_id === prog.id)
                .sort((a, b) => (a.position || 99) - (b.position || 99));

              return (
                <div
                  key={prog.id}
                  className="app-card"
                  style={{
                    overflow: "hidden",
                    border: isExpanded ? "1.5px solid #1A56DB" : "1px solid #E4EAF4",
                    boxShadow: isExpanded
                      ? "0 4px 24px rgba(26,86,219,0.15)"
                      : "0 2px 16px rgba(30,64,175,0.06)",
                    transition: "border 0.2s, box-shadow 0.2s",
                    borderRadius: 16,
                  }}
                >
                  {/* Header row */}
                  <div
                    onClick={() => toggleExpand(prog)}
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      cursor: prog.is_revealed ? "pointer" : "default",
                      background: isExpanded ? "#F0F5FF" : "#fff",
                      transition: "background 0.2s",
                      opacity: prog.is_revealed ? 1 : 0.7,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Category letter avatar */}
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#E8EFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 18,
                          color: "#1A56DB",
                          flexShrink: 0,
                        }}
                      >
                        {prog.category.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#1A56DB",
                              background: "#E8EFFF",
                              padding: "2px 8px",
                              borderRadius: 99,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {prog.category}
                          </span>
                          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                            {prog.points_1st}/{prog.points_2nd}/{prog.points_3rd} pts
                          </span>
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
                          {prog.name}
                        </h3>
                      </div>
                    </div>

                    {/* Right action */}
                    <div style={{ flexShrink: 0 }}>
                      {!prog.is_revealed ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            borderRadius: 99,
                            background: "#F5F7FC",
                            color: "#9CA3AF",
                            fontSize: 11,
                            fontWeight: 600,
                            border: "1px solid #E4EAF4",
                          }}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(prog);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 14px",
                            borderRadius: 99,
                            background: isExpanded ? "#F5F7FC" : "#1A56DB",
                            color: isExpanded ? "#1A56DB" : "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            border: isExpanded ? "1.5px solid #E4EAF4" : "none",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: isExpanded ? "none" : "0 4px 12px rgba(26,86,219,0.3)",
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {isExpanded ? "Hide Result" : "Show Result"}
                          <ChevronDown
                            className="w-4 h-4"
                            style={{
                              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.3s",
                            }}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Podium */}
                  {prog.is_revealed && isExpanded && (
                    <div
                      className="accordion-body"
                      style={{
                        padding: "20px",
                        borderTop: "1px solid #E4EAF4",
                        background: "#F8FAFF",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProgramId(null);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 14px",
                              borderRadius: 99,
                              background: "#FFF",
                              color: "#1F2937",
                              fontSize: 12,
                              fontWeight: 800,
                              border: "1.5px solid #D1D5DB",
                              cursor: "pointer",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#F3F4F6";
                              e.currentTarget.style.borderColor = "#9CA3AF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#FFF";
                              e.currentTarget.style.borderColor = "#D1D5DB";
                            }}
                          >
                            <ArrowLeft className="w-4 h-4 text-blue-600" />
                            <span>Back</span>
                          </button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProgramId(null);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "6px 12px",
                              borderRadius: 99,
                              background: "#FEF2F2",
                              color: "#EF4444",
                              fontSize: 11,
                              fontWeight: 700,
                              border: "1px solid #FCA5A5",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#EF4444";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#FEF2F2";
                              e.currentTarget.style.color = "#EF4444";
                            }}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Close</span>
                          </button>
                        </div>
                      </div>

                      {progResults.length > 0 ? (
                        <div className="winners-podium-grid">
                          {progResults.map((res) => {
                            const directTeam = teams.find((t) => t.id === res.student_id || (res.team_id && t.id === res.team_id));
                            const student    = !directTeam ? students.find((s) => s.id === res.student_id) : null;
                            const team       = directTeam || (student ? teams.find((t) => t.id === student.team_id) : null);
                            const numPos  = res.position ? Number(res.position) : null;
                            const isTop3  = numPos !== null && numPos >= 1 && numPos <= 3;
                            const borderColor = isTop3
                              ? (numPos === 1 ? "#F59E0B" : numPos === 2 ? "#6B7280" : "#CD7F32")
                              : "#3B82F6";
                            const bgGradient = isTop3
                              ? (numPos === 1 
                                  ? "linear-gradient(180deg, rgba(254, 243, 199, 0.35) 0%, #FFFFFF 60%)" 
                                  : numPos === 2 
                                  ? "linear-gradient(180deg, rgba(241, 245, 249, 0.5) 0%, #FFFFFF 60%)" 
                                  : "linear-gradient(180deg, rgba(255, 237, 213, 0.35) 0%, #FFFFFF 60%)")
                              : "linear-gradient(180deg, rgba(232, 239, 255, 0.35) 0%, #FFFFFF 60%)";
                            const posLabel = isTop3 ? (numPos === 1 ? "1st Place 🥇" : numPos === 2 ? "2nd Place 🥈" : "3rd Place 🥉") : "Grade Winner 🎖️";

                            return (
                              <div
                                key={res.id}
                                className="winner-card app-card"
                                onClick={() => {
                                  if (student) setSelectedPopupStudent(student);
                                }}
                                style={{
                                  borderTop: `4px solid ${borderColor}`,
                                  background: bgGradient,
                                  cursor: student ? "pointer" : "default",
                                }}
                                title={student ? `View ${student.name}'s Gained Points Breakdown` : undefined}
                              >
                                {/* Position Status Badge */}
                                <div
                                  style={{
                                    padding: "3px 8px",
                                    borderRadius: 99,
                                    background: borderColor,
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: 10,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 3,
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {posLabel}
                                </div>

                                {directTeam ? (
                                  <>
                                    <div
                                      style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        background: directTeam.color || "#1A56DB",
                                        border: `3px solid ${borderColor}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 900,
                                        fontSize: 12,
                                        color: directTeam.color === "#FFFFFF" ? "#111827" : "#FFFFFF",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                      }}
                                    >
                                      {directTeam.name.slice(0, 3)}
                                    </div>
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                      <h5 style={{ fontWeight: 900, fontSize: 14, color: "#111827", lineHeight: 1.2 }}>
                                        {directTeam.name}
                                      </h5>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: "#1A56DB", background: "#E8EFFF", padding: "2px 6px", borderRadius: 4, marginTop: 2, display: "inline-block" }}>
                                        Group Winner
                                      </span>
                                    </div>
                                  </>
                                ) : student ? (
                                  <>
                                    <StudentAvatar
                                      src={student.photo_url}
                                      alt={student.name}
                                      size={48}
                                      borderColor={borderColor}
                                    />
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                      <h5 style={{ fontWeight: 800, fontSize: 13, color: "#111827", lineHeight: 1.2, wordBreak: "break-word" }}>
                                        {student.name}
                                      </h5>
                                      {student.chest_no && (
                                        <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280" }}>
                                          #{student.chest_no}
                                        </span>
                                      )}
                                      {team && (
                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 2, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {team.name}
                                        </p>
                                      )}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                                      {res.grade && (
                                        <span
                                          style={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            background: "#FEF3C7",
                                            color: "#D97706",
                                            padding: "2px 6px",
                                            borderRadius: 99,
                                            border: "1px solid #FCD34D",
                                          }}
                                        >
                                          Grade {res.grade}
                                        </span>
                                      )}
                                      <span
                                        style={{
                                          background: "#E8EFFF",
                                          color: "#1A56DB",
                                          padding: "2px 8px",
                                          borderRadius: 99,
                                          fontSize: 11,
                                          fontWeight: 800,
                                          border: "1px solid #C7D2FE",
                                        }}
                                      >
                                        +{res.points_awarded} pts
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>
                                    No winner declared
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>
                          Results marked as revealed but individual winners not yet submitted.
                        </p>
                      )}

                      {/* Bottom Back Button for Mobile */}
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #E4EAF4" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedProgramId(null);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 20px",
                            borderRadius: 99,
                            background: "#1A56DB",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(26,86,219,0.25)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Programs</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tiny open / expand button for programs */}
            {filteredPrograms.length > 6 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, paddingTop: 8 }}>
                {showAllPrograms && (
                  <button
                    onClick={() => {
                      setShowAllPrograms(false);
                      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 16px",
                      borderRadius: 99,
                      background: "linear-gradient(135deg, #FFFDF0 0%, #FEF3C7 100%)",
                      color: "#78350F",
                      fontSize: 12,
                      fontWeight: 800,
                      border: "1.5px solid #FCD34D",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 10px rgba(180, 83, 9, 0.18)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FEF3C7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #FFFDF0 0%, #FEF3C7 100%)";
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 text-amber-800" />
                    <span>Go Back</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAllPrograms(!showAllPrograms)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 16px",
                    borderRadius: 99,
                    background: "#E8EFFF",
                    color: "#1A56DB",
                    fontSize: 12,
                    fontWeight: 700,
                    border: "1px solid #C7D2FE",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(26, 86, 219, 0.12)",
                  }}
                >
                  <span>
                    {showAllPrograms
                      ? "Show Less"
                      : `Show All Programs (${filteredPrograms.length})`}
                  </span>
                  <ChevronDown
                    className="w-4 h-4"
                    style={{
                      transform: showAllPrograms ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
              </div>
            )}
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#9CA3AF", padding: "32px 0", fontSize: 13 }}>
            No programs found in this category.
          </p>
        )}
      </div>

      {/* Floating Corner-Side Back Button when All Programs are Opened */}
      {showAllPrograms && (
        <button
          onClick={() => {
            setShowAllPrograms(false);
            document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            position: "fixed",
            bottom: 28,
            right: 24,
            zIndex: 999,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #FFFDF0 0%, #FEF3C7 50%, #FDE68A 100%)",
            color: "#78350F",
            fontSize: 13,
            fontWeight: 800,
            border: "2px solid #FCD34D",
            boxShadow: "0 8px 24px rgba(180, 83, 9, 0.25)",
            cursor: "pointer",
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#78350F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFDF0",
            }}
          >
            <X className="w-3.5 h-3.5" />
          </div>
          <span>Back to 6 Programs</span>
        </button>
      )}
      {/* Student Gained Points Popup Modal */}
      <StudentPointsModal
        student={selectedPopupStudent}
        teams={teams}
        programs={programs}
        results={results}
        allStudents={students}
        onClose={() => setSelectedPopupStudent(null)}
      />
    </section>
  );
}
