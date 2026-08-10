"use client";

import { Team, ScoreProgressionPoint } from "@/types";
import { Trophy, TrendingUp, ChevronRight, ArrowUpRight } from "lucide-react";
import { TeamLogoAvatar } from "@/components/TeamLogoAvatar";
import { TeamHorizontalBarChart, getTeamStyling } from "@/components/TeamHorizontalBarChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ScoreboardProps {
  teams: Team[];
  scoreProgression: ScoreProgressionPoint[];
  onSelectTeam: (team: Team) => void;
}

const RANK_LABELS = ["RANK 01", "RANK 02", "RANK 03", "RANK 04"];
const RANK_TROPHIES = ["🥇", "🥈", "🥉", ""];

export function Scoreboard({ teams, scoreProgression, onSelectTeam }: ScoreboardProps) {
  const maxScore = Math.max(...teams.map((t) => t.total_score), 1);
  const sortedTeams = [...teams].sort((a, b) => b.total_score - a.total_score);

  return (
    <section id="scoreboard" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">

      {/* ── Section Header ── */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 14px", borderRadius: 999,
          background: "rgba(239, 68, 68, 0.1)", color: "#EF4444",
          fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}>
          <Trophy style={{ width: 13, height: 13 }} />
          Live Fest Standings
        </span>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(24px,4.5vw,38px)", color: "#111827", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          KIZIL ELMA Main Scoreboard
        </h2>
      </div>

      {/* ── Realistic Moving Horizontal Bar Chart ── */}
      <TeamHorizontalBarChart teams={teams} onSelectTeam={onSelectTeam} />

      {/* ── Team Summary Cards ── */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A56DB" }} />
          Team Performance Overview
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
          className="scoreboard-grid"
        >
          {sortedTeams.map((team, idx) => {
            const styling = getTeamStyling(team);
            const rankLabel = RANK_LABELS[idx] ?? `RANK ${String(idx + 1).padStart(2, "0")}`;
            const trophy = RANK_TROPHIES[idx] ?? "";

            return (
              <div
                key={team.id}
                onClick={() => onSelectTeam(team)}
                style={{
                  background: styling.bg,
                  borderRadius: 20,
                  border: `1.5px solid ${styling.border}`,
                  borderTop: `4px solid ${styling.border}`,
                  boxShadow: "0 2px 16px rgba(30,64,175,0.07)",
                  padding: "16px 14px 14px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transition: "transform 0.2s, boxShadow 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${styling.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(30,64,175,0.07)";
                }}
              >
                {/* Trophy badge top-right */}
                {trophy && (
                  <span style={{
                    position: "absolute", top: 10, right: 12,
                    fontSize: 18, lineHeight: 1,
                  }}>
                    {trophy}
                  </span>
                )}

                {/* Logo + Rank */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TeamLogoAvatar
                    team={team}
                    size={44}
                    borderRadius={12}
                    style={{ border: `2px solid ${styling.border}` }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 10, fontWeight: 700, color: "#9CA3AF",
                      textTransform: "uppercase", letterSpacing: "0.07em",
                      marginBottom: 2,
                    }}>
                      {rankLabel}
                    </p>
                    <h3 style={{
                      fontWeight: 900, fontSize: 14, color: "#111827",
                      wordBreak: "break-word", lineHeight: 1.25,
                    }}>
                      {team.name}
                    </h3>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

                {/* Score row */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: 3,
                      fontSize: 11, color: styling.text, fontWeight: 700,
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    View Roster
                    <ChevronRight style={{ width: 13, height: 13 }} />
                  </button>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: 900, fontSize: 26, color: styling.text, lineHeight: 1 }}>
                      {team.total_score.toLocaleString()}
                    </span>
                    <span style={{ display: "block", fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>
                      pts
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 5, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${Math.max(6, (team.total_score / maxScore) * 100)}%`,
                    background: styling.bar,
                    transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>

                {/* Watermark arrow */}
                <ArrowUpRight style={{
                  position: "absolute", bottom: 10, right: 10,
                  width: 28, height: 28, color: styling.text,
                  opacity: 0.12,
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* responsive override via injected CSS */}
      <style>{`
        @media (min-width: 640px) {
          .scoreboard-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
        @media (min-width: 1024px) {
          .scoreboard-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 20px !important; }
        }
      `}</style>

      {/* ── Progression Graph ── */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #E4EAF4",
        boxShadow: "0 2px 16px rgba(30,64,175,0.07)",
        padding: "24px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 6 }}>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp style={{ width: 18, height: 18, color: "#1A56DB" }} />
              Team Progression Timeline
            </h3>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Progression by Revealed Event</p>
          </div>
        </div>

        {scoreProgression.length > 0 ? (
          <div style={{ width: "100%" }}>
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreProgression} margin={{ top: 8, right: 12, left: -14, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" />
                  <XAxis dataKey="program" stroke="#E4EAF4" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <YAxis stroke="#E4EAF4" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff", borderColor: "#E4EAF4",
                      borderRadius: 12, boxShadow: "0 8px 24px rgba(30,64,175,0.12)",
                      color: "#111827", fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} />
                  {sortedTeams.map((team) => {
                    const styling = getTeamStyling(team);
                    return (
                      <Line
                        key={team.id}
                        type="monotone"
                        dataKey={team.name}
                        stroke={styling.text}
                        strokeWidth={2.5}
                        dot={{ fill: styling.text, r: 4 }}
                        activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 13, fontStyle: "italic" }}>
            No revealed programs yet. Admin will reveal results during the fest!
          </div>
        )}
      </div>
    </section>
  );
}
