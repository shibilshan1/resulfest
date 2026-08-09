"use client";

import { useEffect, useRef } from "react";
import { Student, Team, Program, Result } from "@/types";
import { X, Trophy, TrendingUp, Award, Star, Medal, Sparkles } from "lucide-react";
import { StudentAvatar } from "./Leaderboard";

interface StudentPointsModalProps {
  student: Student | null;
  teams: Team[];
  programs: Program[];
  results: Result[];
  allStudents?: Student[];
  onClose: () => void;
}

export function StudentPointsModal({
  student,
  teams,
  programs,
  results,
  allStudents = [],
  onClose,
}: StudentPointsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key or clicking backdrop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const team = teams.find((t) => t.id === student.team_id);
  const studentResults = results
    .filter((r) => r.student_id === student.id)
    .sort((a, b) => (b.points_awarded || 0) - (a.points_awarded || 0));

  const totalGainedPoints = studentResults.reduce(
    (sum, r) => sum + (r.points_awarded || 0),
    0
  );

  // Calculate overall rank
  const sortedAllStudents = [...allStudents].sort(
    (a, b) => b.total_points - a.total_points
  );
  const rankIdx = sortedAllStudents.findIndex((s) => s.id === student.id);
  const overallRank = rankIdx !== -1 ? rankIdx + 1 : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeInUp 0.25s ease forwards",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]"
        style={{
          boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.3)",
          animation: "fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Top Header Background Banner */}
        <div
          className="h-28 w-full relative"
          style={{
            background: team?.color
              ? `linear-gradient(135deg, ${team.color}DF 0%, ${team.color}99 100%)`
              : "linear-gradient(135deg, #1A56DB 0%, #1D4ED8 100%)",
          }}
        >
          {/* Close X Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            title="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Decorative Sparkles */}
          <div className="absolute top-3 left-3 opacity-30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Round Profile Avatar Overlay */}
        <div className="relative px-6 pt-0 pb-4 text-center flex flex-col items-center">
          <div
            className="-mt-14 mb-3 relative"
            style={{
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
            }}
          >
            {/* Round Shape Profile */}
            <StudentAvatar
              src={student.photo_url}
              alt={student.name}
              size={84}
              borderColor="#FFFFFF"
            />
            {overallRank && overallRank <= 3 && (
              <span
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  background:
                    overallRank === 1
                      ? "#F59E0B"
                      : overallRank === 2
                      ? "#9CA3AF"
                      : "#CD7F32",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 900,
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {overallRank}
              </span>
            )}
          </div>

          {/* Student Name */}
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {student.name}
          </h3>

          {/* Chest Number & Team Pill */}
          <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
            {student.chest_no && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-xs border border-slate-200">
                Chest #{student.chest_no}
              </span>
            )}
            {team && (
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5"
                style={{
                  background: team.color ? `${team.color}15` : "#E8EFFF",
                  color: team.color && team.color !== "#FFFFFF" ? team.color : "#1A56DB",
                  border: `1px solid ${team.color ? `${team.color}40` : "#93C5FD"}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: team.color || "#1A56DB" }}
                />
                {team.name}
              </span>
            )}
            {overallRank && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-extrabold text-xs border border-amber-200/80 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500 fill-amber-500" />
                Rank #{overallRank}
              </span>
            )}
          </div>

          {/* ── Gained Points Tiny Green Highlight Pill ── */}
          <div className="mt-4 w-full p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Total Points
                </p>
                <p className="text-lg font-black text-slate-800 leading-none">
                  {student.total_points.toLocaleString()} <span className="text-xs font-semibold text-slate-400">pts</span>
                </p>
              </div>
            </div>

            {/* Tiny Green Gained Score Badge */}
            <div
              className="px-3 py-1 rounded-full font-black text-xs inline-flex items-center gap-1 shadow-xs"
              style={{
                background: "#DCFCE7",
                color: "#15803D",
                border: "1px solid #86EFAC",
              }}
            >
              <span className="text-emerald-600 font-black">+</span>
              <span>{totalGainedPoints > 0 ? totalGainedPoints : student.total_points}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-700">pts gained</span>
            </div>
          </div>
        </div>

        {/* ── Gained Points Breakdown List ── */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#1A56DB]" />
              Gained Points Breakdown
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              {studentResults.length} {studentResults.length === 1 ? "Event" : "Events"}
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {studentResults.length > 0 ? (
              studentResults.map((res) => {
                const prog = programs.find((p) => p.id === res.program_id);
                const posLabel =
                  res.position === 1
                    ? "1st Place 🥇"
                    : res.position === 2
                    ? "2nd Place 🥈"
                    : res.position === 3
                    ? "3rd Place 🥉"
                    : res.grade
                    ? `Grade ${res.grade}`
                    : "Participated";

                return (
                  <div
                    key={res.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-3 shadow-2xs transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {prog ? prog.name : "Unknown Program"}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{posLabel}</span>
                        {prog?.category && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 font-bold">{prog.category}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Tiny Green Gained Score */}
                    <div
                      className="px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-0.5 flex-shrink-0"
                      style={{
                        background: "#ECFDF5",
                        color: "#16A34A",
                        border: "1px solid #A7F3D0",
                      }}
                    >
                      <span className="text-[10px]">+</span>
                      <span>{res.points_awarded || 0}</span>
                      <span className="text-[9px] uppercase font-bold ml-0.5">pts</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl bg-white border border-slate-100 text-center">
                <p className="text-xs font-medium text-slate-400 italic">
                  No individual points recorded yet for this student.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
