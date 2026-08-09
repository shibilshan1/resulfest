"use client";

import { useEffect, useState } from "react";
import { Student, Program, Team, Result } from "@/types";
import { Sparkles, X, Trophy, TrendingUp, ChevronRight } from "lucide-react";
import { StudentAvatar } from "./Leaderboard";

interface LiveResultPopupProps {
  result: Result | null;
  program: Program | null;
  student: Student | null;
  team: Team | null;
  onClose: () => void;
  onOpenFullModal?: (student: Student) => void;
}

export function LiveResultPopup({
  result,
  program,
  student,
  team,
  onClose,
  onOpenFullModal,
}: LiveResultPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result && student) {
      setVisible(true);
      const timer = setTimeout(() => {
        // Auto slide out after 6 seconds
        setVisible(false);
        setTimeout(onClose, 300);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [result, student, onClose]);

  if (!result || !student || !visible) return null;

  const posLabel =
    result.position === 1
      ? "1st Place 🥇"
      : result.position === 2
      ? "2nd Place 🥈"
      : result.position === 3
      ? "3rd Place 🥉"
      : result.grade
      ? `Grade ${result.grade}`
      : "Winner 🏆";

  return (
    <div
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 transition-all duration-300 ease-out transform"
      style={{
        animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <div
        className="relative w-full p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xl flex items-center gap-3.5 cursor-pointer overflow-hidden"
        style={{
          boxShadow: "0 16px 40px -10px rgba(0, 98, 210, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
        }}
        onClick={() => {
          if (onOpenFullModal) onOpenFullModal(student);
          onClose();
        }}
      >
        {/* Top Accent Gradient Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: team?.color
              ? `linear-gradient(90deg, ${team.color} 0%, #16A34A 100%)`
              : "linear-gradient(90deg, #0062D2 0%, #16A34A 100%)",
          }}
        />

        {/* Round Shape Minimized Profile Photo */}
        <div className="relative flex-shrink-0 pt-1">
          <StudentAvatar
            src={student.photo_url}
            alt={student.name}
            size={52}
            borderColor={team?.color || "#0062D2"}
          />
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
          >
            ✓
          </span>
        </div>

        {/* Info Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0 animate-bounce-light" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              RESULT ANNOUNCED!
            </span>
          </div>

          <h4 className="text-sm font-black text-slate-900 truncate leading-tight">
            {student.name}
          </h4>

          <p className="text-[11px] font-bold text-slate-500 truncate flex items-center gap-1 mt-0.5">
            <span>{program ? program.name : "Event Result"}</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-extrabold">{posLabel}</span>
          </p>
        </div>

        {/* Tiny Green Gained Points Pill */}
        <div className="flex flex-col items-end flex-shrink-0 gap-1 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className="px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 shadow-xs"
            style={{
              background: "#DCFCE7",
              color: "#15803D",
              border: "1.5px solid #86EFAC",
            }}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            <span>+{result.points_awarded || 0}</span>
            <span className="text-[9px] uppercase font-bold text-emerald-700">pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
