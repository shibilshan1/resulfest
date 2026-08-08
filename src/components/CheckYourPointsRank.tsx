"use client";

import { useState, useEffect, useRef } from "react";
import { Student, Team, Program, Result } from "@/types";
import { Search, Trophy, Sparkles, ChevronDown, X } from "lucide-react";
import { StudentAvatar } from "./Leaderboard";

interface CheckYourPointsRankProps {
  students: Student[];
  teams: Team[];
  results: Result[];
  programs: Program[];
}

export function CheckYourPointsRank({
  students,
  teams,
  results,
  programs,
}: CheckYourPointsRankProps) {
  const [checkQuery, setCheckQuery] = useState("");
  const [expandedCheckStudentId, setExpandedCheckStudentId] = useState<string | null>(null);

  const isPopStateRef = useRef(false);
  const prevQueryRef = useRef("");
  const prevExpandedRef = useRef<string | null>(null);

  // Sync refs
  useEffect(() => {
    prevQueryRef.current = checkQuery;
    prevExpandedRef.current = expandedCheckStudentId;
  }, [checkQuery, expandedCheckStudentId]);

  // Handle popstate for mobile back button
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = (e: PopStateEvent) => {
      isPopStateRef.current = true;
      const state = e.state;

      if (state && typeof state.checkStudentId !== "undefined") {
        setExpandedCheckStudentId(state.checkStudentId);
        if (typeof state.checkQuery !== "undefined") {
          setCheckQuery(state.checkQuery);
        }
      } else if (state && typeof state.checkQuery !== "undefined") {
        setExpandedCheckStudentId(null);
        setCheckQuery(state.checkQuery);
      } else {
        // Fallback: If user hits mobile back while student status is expanded, collapse details. If search query was active, clear search.
        if (prevExpandedRef.current !== null) {
          setExpandedCheckStudentId(null);
        } else if (prevQueryRef.current !== "") {
          setCheckQuery("");
        }
      }

      setTimeout(() => {
        isPopStateRef.current = false;
      }, 50);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleToggleExpand = (studentId: string) => {
    const isCurrentlyExpanded = expandedCheckStudentId === studentId;
    if (isCurrentlyExpanded) {
      setExpandedCheckStudentId(null);
    } else {
      setExpandedCheckStudentId(studentId);
      if (typeof window !== "undefined" && !isPopStateRef.current) {
        window.history.pushState(
          { ...window.history.state, checkQuery, checkStudentId: studentId },
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  };

  const handleQueryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (checkQuery === "" && val.trim() !== "" && typeof window !== "undefined" && !isPopStateRef.current) {
      window.history.pushState(
        { ...window.history.state, checkQuery: val, checkStudentId: null },
        "",
        window.location.pathname + window.location.search
      );
    }
    setCheckQuery(val);
    if (val.trim() === "") {
      setExpandedCheckStudentId(null);
    }
  };

  const handleClearQuery = () => {
    setCheckQuery("");
    setExpandedCheckStudentId(null);
  };

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  const allStudentsRanked = [...students].sort((a, b) => b.total_points - a.total_points);

  const getStudentRank = (studentId: string) => {
    const idx = allStudentsRanked.findIndex((s) => s.id === studentId);
    return idx !== -1 ? idx + 1 : 0;
  };

  const checkResults =
    checkQuery.trim() === ""
      ? []
      : students
          .filter((s) => {
            const q = checkQuery.toLowerCase().trim();
            const team = teams.find((t) => t.id === s.team_id);
            return (
              s.name.toLowerCase().includes(q) ||
              (s.chest_no ? String(s.chest_no).includes(q) : false) ||
              (team ? team.name.toLowerCase().includes(q) : false)
            );
          })
          .sort((a, b) => b.total_points - a.total_points);

  return (
    <section style={{ width: "100%", maxWidth: "100%", padding: "4px 8px 2px", margin: "0 auto", boxSizing: "border-box" }}>
      {/* ── Compact Curved Optical Bar ── */}
      <div
        id="check-points"
        style={{
          width: "100%",
          padding: "5px 12px",
          borderRadius: 999,
          background: "linear-gradient(135deg, rgba(220, 38, 38, 0.96) 0%, rgba(185, 28, 28, 0.98) 50%, rgba(127, 29, 29, 1) 100%)",
          color: "#fff",
          border: "1px solid rgba(255, 180, 190, 0.5)",
          boxShadow: `
            0 0 16px rgba(220, 38, 38, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.35),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3)
          `,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          boxSizing: "border-box",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Bar Row: Title + Integrated Search Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          {/* Left Title with Trophy Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.22)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 6px rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                flexShrink: 0,
              }}
            >
              <Trophy style={{ width: 11, height: 11, color: "#FFF" }} />
            </span>
            <h3 style={{ fontSize: 11, fontWeight: 900, color: "#FFFFFF", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>
              CHECK POINTS & RANK
            </h3>
          </div>

          {/* Right Input Field */}
          <div style={{ position: "relative", flex: 1, minWidth: 140, maxWidth: 340 }}>
            <div
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search className="w-3 h-3 text-white/80" />
            </div>

            <input
              type="text"
              placeholder="Chest no. or name..."
              value={checkQuery}
              onChange={handleQueryInputChange}
              style={{
                width: "100%",
                padding: "5px 26px 5px 28px",
                borderRadius: 999,
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                outline: "none",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                backdropFilter: "blur(8px)",
              }}
            />

            {checkQuery.trim() !== "" && (
              <button
                onClick={handleClearQuery}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "none",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Search Results Dropdown Container */}
        {checkQuery.trim() !== "" && (
          <div style={{ marginTop: 4, paddingTop: 10, borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
            {checkResults.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#FFD1D7", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
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
                        background: "rgba(0, 0, 0, 0.35)",
                        backdropFilter: "blur(14px)",
                        borderRadius: 18,
                        padding: "14px 16px",
                        border: isExpanded ? "1.5px solid #FFD1D7" : "1px solid rgba(255, 255, 255, 0.2)",
                        borderLeft: `5px solid ${team?.color || "#3B82F6"}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: isExpanded ? 12 : 8,
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                      }}
                      onClick={() => handleToggleExpand(stud.id)}
                    >
                      {/* Top Row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <StudentAvatar
                            src={stud.photo_url}
                            alt={stud.name}
                            size={46}
                            borderColor={team?.color || "#fff"}
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <h4 style={{ fontWeight: 800, fontSize: 15, color: "#fff", margin: 0 }}>
                                {stud.name}
                              </h4>
                              {stud.chest_no && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    background: "rgba(255, 255, 255, 0.25)",
                                    color: "#FFF",
                                    padding: "2px 8px",
                                    borderRadius: 99,
                                  }}
                                >
                                  #{stud.chest_no}
                                </span>
                              )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: team?.color || "#3B82F6",
                                  display: "inline-block",
                                }}
                              />
                              <span style={{ fontSize: 11, color: "#FFD1D7", fontWeight: 600 }}>
                                Group: {team ? team.name : "Unassigned"}
                              </span>
                              {stud.grade && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                    background: "rgba(245, 159, 11, 0.3)",
                                    color: "#FDE047",
                                    padding: "1px 6px",
                                    borderRadius: 6,
                                    border: "1px solid rgba(245, 159, 11, 0.5)",
                                  }}
                                >
                                  Grade {stud.grade}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: rankBadgeColor,
                                color: "#fff",
                                padding: "3px 10px",
                                borderRadius: 99,
                                fontSize: 11,
                                fontWeight: 800,
                                marginBottom: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                              }}
                            >
                              <Trophy style={{ width: 12, height: 12 }} />
                              Rank #{rankNum}
                            </div>
                            <div>
                              <span style={{ fontSize: 20, fontWeight: 900, color: "#FDE047" }}>
                                {stud.total_points.toLocaleString()}
                              </span>
                              <span style={{ fontSize: 10, color: "#FFD1D7", fontWeight: 600, marginLeft: 4 }}>
                                pts
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "7px 12px",
                              borderRadius: 99,
                              background: isExpanded ? "rgba(255, 255, 255, 0.25)" : "#FFFFFF",
                              color: isExpanded ? "#FFF" : "#991B1B",
                              fontSize: 11,
                              fontWeight: 800,
                              border: "none",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                              transition: "all 0.2s ease",
                              flexShrink: 0,
                            }}
                          >
                            <span>{isExpanded ? "Hide Status" : "View Status"}</span>
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

                      {/* Expandable Breakdown */}
                      {isExpanded && (
                        <>
                          {studentResults.length > 0 && (
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                              padding: "8px 12px",
                              background: "rgba(0, 0, 0, 0.3)",
                              borderRadius: 12,
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              marginTop: 2,
                            }}>
                              <span style={{ fontSize: 10, color: "#FFD1D7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Gained Status:
                              </span>
                              {firstsCount > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#FBBF24", background: "rgba(245, 159, 11, 0.25)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(245, 159, 11, 0.4)" }}>
                                  🥇 {firstsCount} First Place{firstsCount > 1 ? "s" : ""}
                                </span>
                              )}
                              {secondsCount > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#E2E8F0", background: "rgba(148, 163, 184, 0.25)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(148, 163, 184, 0.4)" }}>
                                  🥈 {secondsCount} Second Place{secondsCount > 1 ? "s" : ""}
                                </span>
                              )}
                              {thirdsCount > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#FDBA74", background: "rgba(249, 115, 22, 0.25)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(249, 115, 22, 0.4)" }}>
                                  🥉 {thirdsCount} Third Place{thirdsCount > 1 ? "s" : ""}
                                </span>
                              )}
                              <span style={{ fontSize: 10, fontWeight: 800, color: "#93C5FD", background: "rgba(59, 130, 246, 0.25)", padding: "2px 8px", borderRadius: 99, marginLeft: "auto" }}>
                                {studentResults.length} Event Wins
                              </span>
                            </div>
                          )}

                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <p style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color: "#FFD1D7",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              margin: 0,
                            }}>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
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
                                        padding: "7px 10px",
                                        borderRadius: 10,
                                        background: "rgba(0, 0, 0, 0.4)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
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
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {prog ? prog.name : "Program Winner"}
                                        </span>
                                      </div>

                                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                        {res.grade && res.grade !== "No Grade" && (
                                          <span style={{
                                            fontSize: 9,
                                            fontWeight: 800,
                                            background: "rgba(254, 243, 199, 0.25)",
                                            color: "#FDE047",
                                            padding: "2px 6px",
                                            borderRadius: 6,
                                            border: "1px solid rgba(254, 243, 199, 0.4)",
                                          }}>
                                            Grade {res.grade}
                                          </span>
                                        )}
                                        <span style={{
                                          fontSize: 11,
                                          fontWeight: 900,
                                          color: "#93C5FD",
                                          background: "rgba(37, 99, 235, 0.3)",
                                          padding: "2px 9px",
                                          borderRadius: 99,
                                          border: "1px solid rgba(147, 197, 253, 0.4)",
                                        }}>
                                          +{res.points_awarded} pts
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ fontSize: 11, color: "#FFD1D7", fontStyle: "italic", padding: "4px 0", margin: 0 }}>
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
                  padding: "16px 12px",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 14,
                  border: "1px dashed rgba(255, 255, 255, 0.3)",
                }}
              >
                <p style={{ fontSize: 12, color: "#FFD1D7", fontWeight: 700, margin: 0 }}>
                  No participant found matching &quot;{checkQuery}&quot;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
