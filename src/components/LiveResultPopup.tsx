"use client";

import { useEffect, useState, useRef } from "react";
import { Student, Program, Team, Result } from "@/types";
import { StudentAvatar } from "./Leaderboard";
import { TrendingUp, X } from "lucide-react";

interface LiveResultPopupProps {
  results: Result[];
  students: Student[];
  teams: Team[];
  programs: Program[];
  onOpenFullModal?: (student: Student) => void;
  onClose?: () => void;
}

export function LiveResultPopup({
  results,
  students,
  teams,
  programs,
  onOpenFullModal,
  onClose,
}: LiveResultPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 1. Filter results to 1st AND 2nd place positions (position 1 & 2) with valid student, points > 0, AND program is revealed
  const topPlaceResults = results.filter((r) => {
    if (!r.student_id || (r.position !== 1 && r.position !== 2) || (r.points_awarded || 0) <= 0) {
      return false;
    }
    const prog = programs.find((p) => p.id === r.program_id);
    return prog ? prog.is_revealed : true;
  });

  // 2. Map program IDs to their latest update timestamp
  const programTimestamps = new Map<string, number>();
  topPlaceResults.forEach((r) => {
    const prog = programs.find((p) => p.id === r.program_id);
    const time = prog?.updated_at
      ? new Date(prog.updated_at).getTime()
      : r.created_at
      ? new Date(r.created_at).getTime()
      : 0;
    const currentMax = programTimestamps.get(r.program_id) || 0;
    programTimestamps.set(r.program_id, Math.max(currentMax, time));
  });

  // Sort program IDs by timestamp descending (latest updated first) and take max 3 programs
  const latest3ProgramIds = Array.from(programTimestamps.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([progId]) => progId);

  // 3. Filter validResults to 1st and 2nd position students belonging to those top 3 latest updated programs
  const validResults = topPlaceResults.filter((r) =>
    latest3ProgramIds.includes(r.program_id)
  );

  // Play through all student results ONCE ONLY (1 second per student)
  useEffect(() => {
    if (validResults.length === 0 || isDismissed) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev >= validResults.length - 1) {
            setIsDismissed(true);
            return prev;
          }
          return prev + 1;
        });
        setIsAnimating(false);
      }, 150);
    }, 1000); // 1 second per student

    return () => clearInterval(timer);
  }, [validResults.length, isDismissed]);

  if (validResults.length === 0 || isDismissed) return null;

  const currentResult = validResults[currentIndex % validResults.length];
  if (!currentResult) return null;

  const student = students.find((s) => s.id === currentResult.student_id);
  if (!student) return null;

  const team = teams.find((t) => t.id === (currentResult.team_id || student.team_id));
  const points = currentResult.points_awarded || 0;

  return (
    <div
      className="fixed bottom-20 right-4 sm:right-6 z-50 transition-all duration-200 ease-out pointer-events-auto"
      style={{
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Game/App Join Style Compact Floating Pill Badge */}
      <div
        className={`relative inline-flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        style={{
          boxShadow: "0 10px 30px -5px rgba(22, 163, 74, 0.3), 0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => {
          if (onOpenFullModal) onOpenFullModal(student);
        }}
        title={`Click to view ${student.name}'s points`}
      >
        {/* Round Profile Photo Avatar */}
        <div className="relative shrink-0">
          <StudentAvatar
            src={student.photo_url}
            alt={student.name}
            size={38}
            borderColor={team?.color || "#16A34A"}
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black border border-white">
            ★
          </span>
        </div>

        {/* Student Name */}
        <div className="flex flex-col min-w-0 max-w-[130px] sm:max-w-[180px]">
          <span className="text-xs font-black text-slate-900 truncate leading-tight">
            {student.name}
          </span>
          <span className="text-[9px] font-extrabold text-slate-400 truncate uppercase tracking-wider">
            {team ? team.name : "Winner"}
          </span>
        </div>

        {/* Tiny Green Gained Points Badge (Game Style) */}
        <div
          className="px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 shrink-0 shadow-xs"
          style={{
            background: "#DCFCE7",
            color: "#15803D",
            border: "1px solid #86EFAC",
          }}
        >
          <TrendingUp className="w-3 h-3 text-emerald-600 stroke-[3]" />
          <span>+{points}</span>
          <span className="text-[9px] uppercase font-extrabold text-emerald-700">pts</span>
        </div>

        {/* Small Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
              onClose();
            }}
            className="ml-0.5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            title="Close notification"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
