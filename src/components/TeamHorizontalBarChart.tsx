"use client";

import { useState, useEffect } from "react";
import { Team } from "@/types";
import { BarChart2 } from "lucide-react";

interface TeamHorizontalBarChartProps {
  teams: Team[];
  onSelectTeam?: (team: Team) => void;
}

const TEAM_GRADIENTS: Record<string, { bar: string; glow: string; text: string; bg: string; border: string }> = {
  "team-a": {
    bar: "linear-gradient(90deg, #94A3B8 0%, #CBD5E1 50%, #FFFFFF 100%)",
    glow: "rgba(255, 255, 255, 0.8)",
    text: "#1E2937",
    bg: "#FFFFFF",
    border: "#CBD5E1",
  },
  "team-b": {
    bar: "linear-gradient(90deg, #0284C7 0%, #38BDF8 70%, #7DD3FC 100%)",
    glow: "rgba(56, 189, 248, 0.5)",
    text: "#0284C7",
    bg: "#F0F9FF",
    border: "#38BDF8",
  },
  "team-c": {
    bar: "linear-gradient(90deg, #DC2626 0%, #EF4444 70%, #FCA5A5 100%)",
    glow: "rgba(239, 68, 68, 0.5)",
    text: "#DC2626",
    bg: "#FEF2F2",
    border: "#EF4444",
  },
  "team-d": {
    bar: "linear-gradient(90deg, #16A34A 0%, #10B981 70%, #6EE7B7 100%)",
    glow: "rgba(16, 185, 129, 0.5)",
    text: "#15803D",
    bg: "#F0FDF4",
    border: "#10B981",
  },
};

export const getTeamStyling = (team: Team) => {
  const nameLower = team.name.toLowerCase();
  if (team.id === "team-a" || nameLower.includes("quba") || nameLower.includes("group a")) {
    return TEAM_GRADIENTS["team-a"];
  }
  if (team.id === "team-b" || nameLower.includes("juhfa") || nameLower.includes("group b")) {
    return TEAM_GRADIENTS["team-b"];
  }
  if (team.id === "team-c" || nameLower.includes("khudyd") || nameLower.includes("group c")) {
    return TEAM_GRADIENTS["team-c"];
  }
  if (team.id === "team-d" || nameLower.includes("thawr") || nameLower.includes("group d")) {
    return TEAM_GRADIENTS["team-d"];
  }
  return TEAM_GRADIENTS["team-b"];
};

const DEFAULT_GRADIENT = TEAM_GRADIENTS["team-b"];

const RANK_BADGES = [
  { label: "1st", color: "#D97706", icon: "🥇", border: "#FCD34D", bg: "#FEF3C7" },
  { label: "2nd", color: "#475569", icon: "🥈", border: "#CBD5E1", bg: "#F1F5F9" },
  { label: "3rd", color: "#92400E", icon: "🥉", border: "#FDBA74", bg: "#FFEDD5" },
  { label: "4th", color: "#64748B", icon: "#4", border: "#E2E8F0", bg: "#F8FAFC" },
];

export function TeamHorizontalBarChart({ teams, onSelectTeam }: TeamHorizontalBarChartProps) {
  const sortedTeams = [...teams].sort((a, b) => b.total_score - a.total_score);
  const maxScore = Math.max(...sortedTeams.map((t) => t.total_score), 150);
  const topScore = sortedTeams[0]?.total_score || 1;



  // Generate gridlines scale
  const gridSteps = [0, Math.round(maxScore * 0.25), Math.round(maxScore * 0.5), Math.round(maxScore * 0.75), maxScore];

  return (
    <div
      className="cream-team-bar-chart-card"
      style={{
        width: "100%",
        background: "#FFFFFF",
        borderRadius: 24,
        border: "1.5px solid #E4EAF4",
        boxShadow: "0 8px 30px rgba(30, 64, 175, 0.08)",
        padding: "28px 24px",
        color: "#111827",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 24,
          borderBottom: "1px solid #E4EAF4",
          paddingBottom: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "clamp(20px, 4vw, 26px)",
              fontWeight: 900,
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            <BarChart2 style={{ width: 26, height: 26, color: "#1A56DB" }} />
            Team Marks Progression
          </h2>
        </div>


      </div>

      {/* Gridlines Scale Background */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Step Grid Markers */}
        <div
          className="grid-scale-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "160px",
            paddingRight: "70px",
            fontSize: 11,
            color: "#6B7280",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: -4,
          }}
        >
          {gridSteps.map((stepVal, idx) => (
            <span key={idx}>{stepVal} PTS</span>
          ))}
        </div>

        {/* Team Bar Rows */}
        {sortedTeams.map((team, idx) => {
          const currentScore = team.total_score;
          const styling = getTeamStyling(team);
          const badge = RANK_BADGES[idx] || RANK_BADGES[3];
          const pct = Math.min(100, Math.max(8, (currentScore / maxScore) * 100));
          const diffFromTop = topScore - currentScore;

          return (
            <div
              key={team.id}
              onClick={() => onSelectTeam && onSelectTeam(team)}
              className="cream-team-bar-row"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "155px 1fr 70px",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 16,
                background: "#F8FAFC",
                border: "1.5px solid #E4EAF4",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {/* Left Column: Rank + Team Name + Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                {/* Rank Badge */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: badge.bg,
                    border: `1.5px solid ${badge.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {badge.icon}
                </div>

                {/* Logo */}
                <img
                  src={team.logo_url}
                  alt={team.name}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: `2px solid ${styling.text}40`,
                    background: "#FFF",
                    flexShrink: 0,
                  }}
                />

                {/* Name */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {team.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                    {idx === 0 ? "🏆 Leader" : `-${diffFromTop} pts behind`}
                  </div>
                </div>
              </div>

              {/* Middle Column: Animated Moving Bar Track */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 30,
                  background: "#E2E8F0",
                  borderRadius: 12,
                  overflow: "hidden",
                  padding: 3,
                  border: "1px solid #CBD5E1",
                }}
              >
                {/* Inner Filled Bar with Gradient & Animation */}
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: styling.bar,
                    borderRadius: 9,
                    position: "relative",
                    transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: `0 2px 10px ${styling.glow}`,
                  }}
                >
                  {/* End Tip Glow Marker */}
                  <span
                    style={{
                      position: "absolute",
                      right: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      boxShadow: `0 0 6px #FFF, 0 0 10px ${styling.text}`,
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Score Badge */}
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 22,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: styling.text,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {currentScore}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                  MARKS
                </span>
              </div>
            </div>
          );
        })}
      </div>



      {/* CSS Animations */}
      <style>{`
        .cream-team-bar-row:hover {
          background: #FFFFFF !important;
          border-color: #1A56DB !important;
          box-shadow: 0 4px 18px rgba(30, 64, 175, 0.12) !important;
          transform: translateY(-2px);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .cream-team-bar-chart-card {
            padding: 16px 10px !important;
            border-radius: 18px !important;
          }
          .cream-team-bar-row {
            grid-template-columns: minmax(105px, 125px) 1fr minmax(45px, 55px) !important;
            gap: 8px !important;
            padding: 10px 8px !important;
          }
          .grid-scale-header {
            padding-left: 110px !important;
            padding-right: 50px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
    </div>
  );
}
