"use client";

import { useState, useEffect, useRef } from "react";
import { Student, Team, Program, Result } from "@/types";
import { Search, Trophy, Crown, Star, ChevronDown, ArrowLeft, X, Sparkles, User } from "lucide-react";

interface LeaderboardProps {
  students: Student[];
  teams: Team[];
  results: Result[];
  programs: Program[];
  showAllStudents?: boolean;
  setShowAllStudents?: (show: boolean) => void;
}

const SCORE_COLORS = ["#F59E0B", "#6B7280", "#CD7F32"];

export function DefaultUserIcon({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block", flexShrink: 0, borderRadius: "50%" }}
    >
      <circle cx="50" cy="50" r="50" fill="#E2E8F0" />
      <circle cx="50" cy="38" r="19" fill="#808080" />
      <path
        d="M 16,88 C 16,64 30,57 50,57 C 70,57 84,64 84,88 C 84,95 78,100 50,100 C 22,100 16,95 16,88 Z"
        fill="#808080"
      />
    </svg>
  );
}

export function StudentAvatar({
  src,
  alt,
  size = 44,
  borderColor = "#E4EAF4",
}: {
  src?: string;
  alt: string;
  size?: number;
  borderColor?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${borderColor}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
        title={`${alt} (Unknown User)`}
      >
        <DefaultUserIcon size={size} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: `2px solid ${borderColor}`,
        flexShrink: 0,
      }}
    />
  );
}

export function Leaderboard({
  students,
  teams,
  results,
  programs,
  showAllStudents: parentShowAllStudents,
  setShowAllStudents: parentSetShowAllStudents,
}: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkQuery, setCheckQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("All");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("All");
  const [localShowAllStudents, setLocalShowAllStudents] = useState<boolean>(false);

  const showAllStudents = parentShowAllStudents !== undefined ? parentShowAllStudents : localShowAllStudents;
  const setShowAllStudents = parentSetShowAllStudents || setLocalShowAllStudents;
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [expandedCheckStudentId, setExpandedCheckStudentId] = useState<string | null>(null);

  const isPopStateRef = useRef(false);
  const prevExpandedRef = useRef<string | null>(null);
  const prevExpandedCheckRef = useRef<string | null>(null);

  // Sync refs
  useEffect(() => {
    prevExpandedRef.current = expandedStudentId;
    prevExpandedCheckRef.current = expandedCheckStudentId;
  }, [expandedStudentId, expandedCheckStudentId]);

  // Handle popstate for mobile back button in Leaderboard
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = (e: PopStateEvent) => {
      isPopStateRef.current = true;
      const state = e.state;

      if (state) {
        if (typeof state.expandedStudentId !== "undefined") {
          setExpandedStudentId(state.expandedStudentId);
        } else if (prevExpandedRef.current !== null) {
          setExpandedStudentId(null);
        }

        if (typeof state.expandedCheckStudentId !== "undefined") {
          setExpandedCheckStudentId(state.expandedCheckStudentId);
        } else if (prevExpandedCheckRef.current !== null) {
          setExpandedCheckStudentId(null);
        }
      } else {
        if (prevExpandedRef.current !== null) {
          setExpandedStudentId(null);
        }
        if (prevExpandedCheckRef.current !== null) {
          setExpandedCheckStudentId(null);
        }
      }

      setTimeout(() => {
        isPopStateRef.current = false;
      }, 50);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleToggleStudentExpand = (studentId: string) => {
    const isCurrentlyExpanded = expandedStudentId === studentId;
    if (isCurrentlyExpanded) {
      setExpandedStudentId(null);
    } else {
      setExpandedStudentId(studentId);
      if (typeof window !== "undefined" && !isPopStateRef.current) {
        window.history.pushState(
          {
            tab: window.history.state?.tab || "leaderboard",
            ...window.history.state,
            expandedStudentId: studentId,
          },
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  };

  const handleToggleCheckStudentExpand = (studentId: string) => {
    const isCurrentlyExpanded = expandedCheckStudentId === studentId;
    if (isCurrentlyExpanded) {
      setExpandedCheckStudentId(null);
    } else {
      setExpandedCheckStudentId(studentId);
      if (typeof window !== "undefined" && !isPopStateRef.current) {
        window.history.pushState(
          {
            tab: window.history.state?.tab || "leaderboard",
            ...window.history.state,
            expandedCheckStudentId: studentId,
          },
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      (s.chest_no ? String(s.chest_no).includes(query) : false);
    const matchesTeam =
      selectedTeamFilter === "All" || s.team_id === selectedTeamFilter;
    return matchesSearch && matchesTeam;
  });

  const sortedStudents = [...filteredStudents].sort(
    (a, b) => b.total_points - a.total_points
  );

  const displayedStudents = showAllStudents
    ? sortedStudents
    : sortedStudents.slice(0, 6);

  const top3 = sortedStudents.slice(0, 3);
  const rest  = sortedStudents.slice(3);

  /* ── helpers ── */
  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  const allStudentsRanked = [...students].sort((a, b) => b.total_points - a.total_points);

  const getStudentRank = (studentId: string) => {
    const idx = allStudentsRanked.findIndex((s) => s.id === studentId);
    return idx !== -1 ? idx + 1 : 0;
  };

  const checkResults = checkQuery.trim() === "" ? [] : students.filter((s) => {
    const q = checkQuery.toLowerCase().trim();
    const team = teams.find((t) => t.id === s.team_id);
    return (
      s.name.toLowerCase().includes(q) ||
      (s.chest_no ? String(s.chest_no).includes(q) : false) ||
      (team ? team.name.toLowerCase().includes(q) : false)
    );
  }).sort((a, b) => b.total_points - a.total_points);

  return (
    <section
      id="leaderboard"
      className="w-full max-w-6xl mx-auto px-4 py-6 space-y-5"
      style={{ paddingBottom: 40 }}
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
          <Trophy className="w-3.5 h-3.5" />
          Individual Excellence
        </div>
        <h2
          style={{
            fontWeight: 900,
            fontSize: "clamp(24px,4.5vw,38px)",
            color: "#111827",
            letterSpacing: "-0.5px",
          }}
        >
          Individual Leaderboard
        </h2>
      </div>

      {/* Team Filter Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {["All", ...teams.map((t) => t.id)].map((filterId) => {
          const teamObj = teams.find((t) => t.id === filterId);
          const label = filterId === "All" ? "All Participants" : (teamObj?.name ?? filterId);
          const isActive = selectedTeamFilter === filterId;
          return (
            <button
              key={filterId}
              onClick={() => setSelectedTeamFilter(filterId)}
              className={`filter-chip${isActive ? " active" : ""}`}
            >
              {label}
            </button>
          );
        })}
      </div>



      {/* ── Top 3 Podium ── */}
      {top3.length > 0 && searchQuery === "" && selectedTeamFilter === "All" && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "clamp(8px, 3.5vw, 24px)",
            paddingTop: 16,
            paddingBottom: 8,
          }}
        >
          {/* 2nd place (left) */}
          {top3[1] && (
            <div style={{ textAlign: "center", flex: 1, maxWidth: "clamp(80px, 28vw, 110px)" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <StudentAvatar
                  src={top3[1].photo_url}
                  alt={top3[1].name}
                  size={68}
                  borderColor="#9CA3AF"
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#9CA3AF",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    border: "2px solid #fff",
                  }}
                >
                  2
                </span>
              </div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginTop: 12 }}>
                {top3[1].name.length > 9 ? top3[1].name.slice(0, 8) + "…" : top3[1].name}
              </p>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#F59E0B" }}>
                {top3[1].total_points.toLocaleString()}
              </p>
              <p style={{ fontSize: 10, color: "#9CA3AF" }}>pts</p>
            </div>
          )}

          {/* 1st place (center – raised) */}
          {top3[0] && (
            <div style={{ textAlign: "center", flex: 1, maxWidth: "clamp(95px, 32vw, 130px)", transform: "translateY(-16px)" }}>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: 4,
                }}
              >
                <StudentAvatar
                  src={top3[0].photo_url}
                  alt={top3[0].name}
                  size={86}
                  borderColor="#F59E0B"
                />
                {/* Star badge */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#F59E0B",
                    color: "#fff",
                    borderRadius: 99,
                    padding: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: 10,
                    fontWeight: 800,
                    border: "2px solid #fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Star className="w-3 h-3" style={{ fill: "#fff", color: "#fff" }} />
                  1
                </span>
              </div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginTop: 14 }}>
                {top3[0].name.length > 10 ? top3[0].name.slice(0, 9) + "…" : top3[0].name}
              </p>
              <p style={{ fontWeight: 900, fontSize: 22, color: "#1A56DB" }}>
                {top3[0].total_points.toLocaleString()}
              </p>
              <p style={{ fontSize: 10, color: "#9CA3AF" }}>pts</p>
            </div>
          )}

          {/* 3rd place (right) */}
          {top3[2] && (
            <div style={{ textAlign: "center", flex: 1, maxWidth: "clamp(80px, 28vw, 110px)" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <StudentAvatar
                  src={top3[2].photo_url}
                  alt={top3[2].name}
                  size={68}
                  borderColor="#CD7F32"
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#CD7F32",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    border: "2px solid #fff",
                  }}
                >
                  3
                </span>
              </div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginTop: 12 }}>
                {top3[2].name.length > 9 ? top3[2].name.slice(0, 8) + "…" : top3[2].name}
              </p>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#F59E0B" }}>
                {top3[2].total_points.toLocaleString()}
              </p>
              <p style={{ fontSize: 10, color: "#9CA3AF" }}>pts</p>
            </div>
          )}
        </div>
      )}

      {/* ── Main Rankings List ── */}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <h3 style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>
            Main Rankings
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {showAllStudents && (
              <button
                onClick={() => {
                  setShowAllStudents(false);
                  document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" });
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
            )}
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
              Showing {displayedStudents.length} of {sortedStudents.length}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sortedStudents.length > 0 ? (
            <>
              {displayedStudents.map((stud, idx) => {
                const team = getTeam(stud.team_id);
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                const scoreColor = isTop3 ? SCORE_COLORS[idx] : "#1A56DB";

                return (
                  <div
                    key={stud.id}
                    className="app-card animate-fadeInUp"
                    style={{
                      overflow: "hidden",
                      cursor: "pointer",
                      animationDelay: `${Math.min(idx * 0.04, 0.5)}s`,
                    }}
                    onClick={() => handleToggleStudentExpand(stud.id)}
                  >
                    {/* Main row */}
                    <div
                      style={{
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      {/* Left: rank + avatar + info */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Rank */}
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: isTop3 ? scoreColor : "#F5F7FC",
                            color: isTop3 ? "#fff" : "#9CA3AF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {rank <= 3 ? (
                            rank === 1 ? <Crown className="w-4 h-4" /> : rank
                          ) : (
                            rank
                          )}
                        </span>

                        {/* WhatsApp Style Avatar */}
                        <StudentAvatar
                          src={stud.photo_url}
                          alt={stud.name}
                          size={44}
                          borderColor="#E4EAF4"
                        />

                        {/* Name + team */}
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                            {stud.name}
                          </h4>
                          {team && (
                            <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                              {team.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: score + bar + chevron */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span
                            style={{
                              fontWeight: 900,
                              fontSize: 20,
                              color: scoreColor,
                            }}
                          >
                            {stud.total_points.toLocaleString()}
                          </span>
                          <div className="progress-bar-track" style={{ width: 64, marginTop: 4, marginLeft: "auto" }}>
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${Math.max(10, (stud.total_points / (sortedStudents[0]?.total_points || 1)) * 100)}%`,
                                background: scoreColor,
                              }}
                            />
                          </div>
                        </div>
                        <ChevronDown
                          style={{
                            width: 16,
                            height: 16,
                            color: "#9CA3AF",
                            transform: expandedStudentId === stud.id ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                            flexShrink: 0,
                          }}
                        />
                      </div>
                    </div>

                    {/* Expanded details: individual gained points, grade & status */}
                    {expandedStudentId === stud.id && (() => {
                      const studentResults = results
                        .filter((r) => r.student_id === stud.id)
                        .sort((a, b) => (b.points_awarded || 0) - (a.points_awarded || 0));

                      if (studentResults.length === 0) {
                        return (
                          <div style={{
                            padding: "10px 16px 14px",
                            borderTop: "1px solid #F0F4FA",
                            background: "#FAFBFE",
                          }}>
                            <p style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic", textAlign: "center" }}>
                              No individual results recorded yet.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div style={{
                          padding: "8px 16px 12px",
                          borderTop: "1px solid #F0F4FA",
                          background: "#FAFBFE",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}>
                          <p style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: "#6B7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 2,
                          }}>
                            Program Breakdown
                          </p>
                          {studentResults.map((res) => {
                            const prog = programs.find((p) => p.id === res.program_id);
                            const posLabel = res.position === 1 ? "1st" : res.position === 2 ? "2nd" : res.position === 3 ? "3rd" : null;
                            const statusColor = res.position === 1 ? "#F59E0B" : res.position === 2 ? "#9CA3AF" : res.position === 3 ? "#CD7F32" : "#3B82F6";

                            return (
                              <div
                                key={res.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 6,
                                  padding: "5px 8px",
                                  borderRadius: 8,
                                  background: "#fff",
                                  border: "1px solid #F0F4FA",
                                }}
                              >
                                {/* Program name */}
                                <span style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: "#374151",
                                  flex: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}>
                                  {prog ? prog.name : "Unknown Program"}
                                </span>

                                {/* Tiny badges: grade, status, points */}
                                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>

                                  {posLabel && (
                                    <span style={{
                                      fontSize: 8,
                                      fontWeight: 800,
                                      background: `${statusColor}18`,
                                      color: statusColor,
                                      padding: "1px 5px",
                                      borderRadius: 4,
                                      lineHeight: "14px",
                                    }}>
                                      {posLabel}
                                    </span>
                                  )}
                                  <span style={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    color: "#1A56DB",
                                    background: "#E8EFFF",
                                    padding: "1px 6px",
                                    borderRadius: 4,
                                    lineHeight: "14px",
                                  }}>
                                    +{res.points_awarded}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}

              {/* Tiny open / expand button for student leaderboard */}
              {sortedStudents.length > 6 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, paddingTop: 8 }}>
                  {showAllStudents && (
                    <button
                      onClick={() => {
                        setShowAllStudents(false);
                        document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" });
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
                    onClick={() => setShowAllStudents(!showAllStudents)}
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
                      {showAllStudents
                        ? "Show Less"
                        : `Show All Participants (${sortedStudents.length})`}
                    </span>
                    <ChevronDown
                      className="w-4 h-4"
                      style={{
                        transform: showAllStudents ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ textAlign: "center", color: "#9CA3AF", padding: "32px 0", fontSize: 13 }}>
              No students found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Floating Corner-Side Back Button when All Participants are Opened */}
      {showAllStudents && (
        <button
          onClick={() => {
            setShowAllStudents(false);
            document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" });
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
          <span>Back to 6 View</span>
        </button>
      )}

      {/* ── Check Your Points & Current Rank Module ── */}
      <div
        id="check-points"
        style={{
          maxWidth: 680,
          margin: "24px auto 0",
          padding: "16px 20px",
          borderRadius: 24,
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 45%, #1A56DB 100%)",
          color: "#fff",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Title Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(245, 159, 11, 0.4)",
                flexShrink: 0,
              }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#FDE047",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: "rgba(254, 224, 71, 0.15)",
                    padding: "2px 8px",
                    borderRadius: 99,
                    border: "1px solid rgba(254, 224, 71, 0.3)",
                  }}
                >
                  LIVE POINTS LOOKUP
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginTop: 2 }}>
                Check Your Points & Rank
              </h3>
            </div>
          </div>
          <span style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
            Total Participants: <strong style={{ color: "#fff" }}>{students.length}</strong>
          </span>
        </div>

        <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.8)", marginBottom: 18, lineHeight: 1.4 }}>
          Search your name or chest number below to check your current festival rank, total points, and group details.
        </p>

        {/* Searching Input with Searching Lens Icon and Adaptable Colors */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          {/* Searching Lens Icon */}
          <div
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: checkQuery.trim() !== "" ? "rgba(56, 189, 248, 0.25)" : "rgba(255, 255, 255, 0.12)",
              transition: "all 0.2s ease",
            }}
          >
            <Search
              className="w-4 h-4"
              style={{
                color: checkQuery.trim() !== "" ? "#38BDF8" : "#94A3B8",
                transition: "color 0.2s ease",
              }}
            />
          </div>

          <input
            type="text"
            placeholder="Type your name or chest number (e.g. 101 or Aisha)..."
            value={checkQuery}
            onChange={(e) => setCheckQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 44px 14px 54px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.12)",
              border: checkQuery.trim() !== "" ? "1.5px solid #38BDF8" : "1.5px solid rgba(255, 255, 255, 0.25)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              boxShadow: checkQuery.trim() !== "" ? "0 0 16px rgba(56, 189, 248, 0.35)" : "none",
              backdropFilter: "blur(8px)",
              transition: "all 0.25s ease",
            }}
          />

          {checkQuery.trim() !== "" && (
            <button
              onClick={() => setCheckQuery("")}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Search Results */}
        {checkQuery.trim() !== "" ? (
          <div>
            {checkResults.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#93C5FD", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Found {checkResults.length} matching participant{checkResults.length > 1 ? "s" : ""}:
                </p>
                {checkResults.map((stud) => {
                  const team = getTeam(stud.team_id);
                  const rankNum = getStudentRank(stud.id);
                  const isTop3 = rankNum <= 3;
                  const isExpanded = expandedCheckStudentId === stud.id;
                  const rankBadgeColor = isTop3
                    ? (rankNum === 1 ? "#F59E0B" : rankNum === 2 ? "#9CA3AF" : "#CD7F32")
                    : "#3B82F6";

                  // Individual results & gained points breakdown per event/program
                  const studentResults = results
                    .filter((r) => r.student_id === stud.id)
                    .sort((a, b) => (b.points_awarded || 0) - (a.points_awarded || 0));

                  const firstsCount  = studentResults.filter((r) => r.position === 1).length;
                  const secondsCount = studentResults.filter((r) => r.position === 2).length;
                  const thirdsCount  = studentResults.filter((r) => r.position === 3).length;

                  return (
                    <div
                      key={stud.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.09)",
                        backdropFilter: "blur(14px)",
                        borderRadius: 20,
                        padding: "16px 18px",
                        border: isExpanded ? "1.5px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.18)",
                        borderLeft: `5px solid ${team?.color || "#3B82F6"}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: isExpanded ? 14 : 10,
                        boxShadow: isExpanded ? "0 12px 36px rgba(56, 189, 248, 0.25)" : "0 8px 32px rgba(0, 0, 0, 0.25)",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                      }}
                      onClick={() => handleToggleCheckStudentExpand(stud.id)}
                    >
                      {/* Top Row: Avatar, Name, Group & Total Rank/Points */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <StudentAvatar
                            src={stud.photo_url}
                            alt={stud.name}
                            size={50}
                            borderColor={team?.color || "#fff"}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <h4 style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                                {stud.name}
                              </h4>
                              {stud.chest_no && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "#F8FAFC",
                                    padding: "2px 8px",
                                    borderRadius: 99,
                                  }}
                                >
                                  #{stud.chest_no}
                                </span>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: team?.color || "#3B82F6",
                                  display: "inline-block",
                                }}
                              />
                              <span style={{ fontSize: 12, color: "#CBD5E1", fontWeight: 600 }}>
                                Group: {team ? team.name : "Unassigned"}
                              </span>

                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: rankBadgeColor,
                                color: "#fff",
                                padding: "4px 12px",
                                borderRadius: 99,
                                fontSize: 12,
                                fontWeight: 800,
                                marginBottom: 4,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                              }}
                            >
                              <Trophy style={{ width: 13, height: 13 }} />
                              Rank #{rankNum}
                            </div>
                            <div>
                              <span style={{ fontSize: 22, fontWeight: 900, color: "#FDE047" }}>
                                {stud.total_points.toLocaleString()}
                              </span>
                              <span style={{ fontSize: 11, color: "#93C5FD", fontWeight: 600, marginLeft: 4 }}>
                                pts
                              </span>
                            </div>
                          </div>

                          {/* Toggle Action Button */}
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 14px",
                              borderRadius: 99,
                              background: isExpanded ? "rgba(255, 255, 255, 0.2)" : "#1A56DB",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 800,
                              border: isExpanded ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
                              boxShadow: isExpanded ? "none" : "0 4px 12px rgba(26, 86, 219, 0.4)",
                              transition: "all 0.2s ease",
                              flexShrink: 0,
                            }}
                          >
                            <span>{isExpanded ? "Hide Status" : "View Gained Status"}</span>
                            <ChevronDown
                              className="w-4 h-4"
                              style={{
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expandable Breakdown — ONLY SHOWN WHEN CLICKED */}
                      {isExpanded && (
                        <>
                          {/* Summary Badges Row: 1st, 2nd, 3rd places count */}
                          {studentResults.length > 0 && (
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              padding: "8px 12px",
                              background: "rgba(0, 0, 0, 0.25)",
                              borderRadius: 12,
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              marginTop: 4,
                            }}>
                              <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Gained Status:
                              </span>
                              {firstsCount > 0 && (
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#FBBF24", background: "rgba(245, 159, 11, 0.2)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(245, 159, 11, 0.3)" }}>
                                  🥇 {firstsCount} First Place{firstsCount > 1 ? "s" : ""}
                                </span>
                              )}
                              {secondsCount > 0 && (
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#E2E8F0", background: "rgba(148, 163, 184, 0.2)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(148, 163, 184, 0.3)" }}>
                                  🥈 {secondsCount} Second Place{secondsCount > 1 ? "s" : ""}
                                </span>
                              )}
                              {thirdsCount > 0 && (
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#FDBA74", background: "rgba(249, 115, 22, 0.2)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(249, 115, 22, 0.3)" }}>
                                  🥉 {thirdsCount} Third Place{thirdsCount > 1 ? "s" : ""}
                                </span>
                              )}
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#60A5FA", background: "rgba(59, 130, 246, 0.2)", padding: "2px 8px", borderRadius: 99, marginLeft: "auto" }}>
                                {studentResults.length} Event Wins
                              </span>
                            </div>
                          )}

                          {/* Individual Gained Status Breakdown Per Program */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <p style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: "#93C5FD",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}>
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Individual Gained Status & Points Breakdown ({studentResults.length})
                            </p>

                            {studentResults.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {studentResults.map((res) => {
                                  const prog = programs.find((p) => p.id === res.program_id);
                                  const numPos = res.position ? Number(res.position) : null;
                                  const posLabel = numPos === 1 ? "1st Place 🥇" : numPos === 2 ? "2nd Place 🥈" : numPos === 3 ? "3rd Place 🥉" : "Grade Winner 🎖️";
                                  const posBadgeBg = numPos === 1 ? "#F59E0B" : numPos === 2 ? "#64748B" : numPos === 3 ? "#EA580C" : "#2563EB";

                                  return (
                                    <div
                                      key={res.id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 8,
                                        padding: "8px 12px",
                                        borderRadius: 12,
                                        background: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid rgba(255, 255, 255, 0.12)",
                                      }}
                                    >
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                                        <span
                                          style={{
                                            padding: "2px 7px",
                                            borderRadius: 6,
                                            background: posBadgeBg,
                                            color: "#fff",
                                            fontSize: 10,
                                            fontWeight: 800,
                                            whiteSpace: "nowrap",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                          }}
                                        >
                                          {posLabel}
                                        </span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {prog ? prog.name : "Program Winner"}
                                        </span>
                                      </div>

                                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

                                        <span style={{
                                          fontSize: 12,
                                          fontWeight: 900,
                                          color: "#60A5FA",
                                          background: "rgba(37, 99, 235, 0.25)",
                                          padding: "3px 10px",
                                          borderRadius: 99,
                                          border: "1px solid rgba(96, 165, 250, 0.4)",
                                        }}>
                                          +{res.points_awarded} pts
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic", padding: "4px 0" }}>
                                No individual points or program wins logged for this participant yet.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 12px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  border: "1px dashed rgba(255,255,255,0.2)",
                }}
              >
                <p style={{ fontSize: 13, color: "#93C5FD", fontWeight: 600 }}>
                  No participant found matching &quot;{checkQuery}&quot;
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                  Try matching the name spelling or chest number (e.g. 101)
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Default state when search is empty */
          <div
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: 16,
              padding: "16px 20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.85)", fontWeight: 500 }}>
                Try searching: <strong style={{ color: "#FDE047" }}>&quot;Aisha&quot;</strong>, <strong style={{ color: "#FDE047" }}>&quot;101&quot;</strong>, or group name
              </span>
            </div>

            {/* Quick click suggestions */}
            {students.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {students.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCheckQuery(s.name)}
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      border: "none",
                      borderRadius: 99,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
                  >
                    {s.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
