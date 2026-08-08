"use client";

import { Team, Student, Program, Result } from "@/types";
import { X, Award, Users, Trophy, ArrowLeft } from "lucide-react";
import { StudentAvatar } from "./Leaderboard";
import { TeamLogoAvatar } from "@/components/TeamLogoAvatar";

interface TeamDetailModalProps {
  team: Team | null;
  students: Student[];
  programs: Program[];
  results: Result[];
  onClose: () => void;
}

export function TeamDetailModal({
  team,
  students,
  programs,
  results,
  onClose,
}: TeamDetailModalProps) {
  if (!team) return null;

  const teamStudents = students.filter((s) => s.team_id === team.id);

  const teamResults = results
    .filter((r) => {
      const stud = students.find((s) => s.id === r.student_id);
      return stud && stud.team_id === team.id;
    })
    .map((r) => {
      const student = students.find((s) => s.id === r.student_id);
      const program = programs.find((p) => p.id === r.program_id);
      return {
        ...r,
        studentName: student?.name || "Unknown Student",
        programName: program?.name || "Unknown Program",
        isRevealed: program?.is_revealed || false,
      };
    })
    .filter((r) => r.isRevealed);

  const posColors = ["#F59E0B", "#9CA3AF", "#CD7F32"];
  const posLabels = ["1st", "2nd", "3rd"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(17,24,39,0.6)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 680,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px rgba(17,24,39,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${team.color}CC 0%, #1A56DB 100%)`,
            padding: "24px 24px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <TeamLogoAvatar
              team={team}
              size={60}
              borderRadius={14}
              style={{
                border: "3px solid rgba(255,255,255,0.4)",
              }}
            />
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Team Profile
              </p>
              <h2 style={{ fontWeight: 900, fontSize: 22, color: "#fff", lineHeight: 1.15 }}>
                {team.name}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {teamStudents.length} Registered Members
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", fontWeight: 600 }}>
                Total Score
              </p>
              <p style={{ fontWeight: 900, fontSize: 26, color: "#fff" }}>
                {team.total_score.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 14px",
                borderRadius: 99,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.35)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#111827";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.25)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                transition: "background 0.2s",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Members */}
          <div>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#111827",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: "1px solid #E4EAF4",
              }}
            >
              <Users className="w-4 h-4" style={{ color: "#1A56DB" }} />
              Student Members & Individual Points
            </h3>

            {teamStudents.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
                  gap: 10,
                }}
              >
                {teamStudents.map((stud) => (
                  <div
                    key={stud.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "#F5F7FC",
                      border: "1px solid #E4EAF4",
                    }}
                  >
                    <StudentAvatar
                      src={stud.photo_url}
                      alt={stud.name}
                      size={40}
                      borderColor="#E4EAF4"
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {stud.name}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#1A56DB" }}>
                        {stud.total_points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>
                No members assigned to this team yet.
              </p>
            )}
          </div>

          {/* Achievements */}
          <div>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#111827",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: "1px solid #E4EAF4",
              }}
            >
              <Award className="w-4 h-4" style={{ color: "#1A56DB" }} />
              Revealed Achievements
            </h3>

            {teamResults.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {teamResults.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "#F5F7FC",
                      border: "1px solid #E4EAF4",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: posColors[(res.position || 1) - 1] ?? "#9CA3AF",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        {posLabels[(res.position || 1) - 1] ?? `${res.position || 1}th`}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                          {res.programName}
                        </p>
                        <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                          Winner: {res.studentName}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#1A56DB",
                        background: "#E8EFFF",
                        padding: "4px 10px",
                        borderRadius: 99,
                      }}
                    >
                      +{res.points_awarded} pts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>
                No program wins revealed for this team yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
