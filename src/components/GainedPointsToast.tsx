"use client";

import { useEffect, useState } from "react";
import { Student, Program, Team } from "@/types";
import { Sparkles, X, TrendingUp } from "lucide-react";
import { StudentAvatar } from "./Leaderboard";

export interface GainedPointNotification {
  id: string;
  student: Student;
  program?: Program;
  team?: Team;
  gainedPoints: number;
}

interface GainedPointsToastProps {
  notification: GainedPointNotification | null;
  onDismiss: () => void;
  onSelectStudent?: (student: Student) => void;
}

export function GainedPointsToast({
  notification,
  onDismiss,
  onSelectStudent,
}: GainedPointsToastProps) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const { student, program, team, gainedPoints } = notification;

  return (
    <div
      className="fixed top-20 right-4 z-50 max-w-xs sm:max-w-sm w-full p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xl flex items-center justify-between gap-3 cursor-pointer"
      style={{
        boxShadow: "0 12px 35px -5px rgba(22, 163, 74, 0.25)",
        animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
      onClick={() => {
        if (onSelectStudent) onSelectStudent(student);
        onDismiss();
      }}
    >
      {/* Round Shape Profile Avatar */}
      <div className="relative flex-shrink-0">
        <StudentAvatar
          src={student.photo_url}
          alt={student.name}
          size={48}
          borderColor="#22C55E"
        />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
          ★
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
            Points Gained!
          </span>
        </div>
        <h5 className="text-xs font-black text-slate-900 truncate mt-0.5">
          {student.name}
        </h5>
        <p className="text-[10px] font-semibold text-slate-500 truncate">
          {program ? program.name : team ? team.name : "Event Result"}
        </p>
      </div>

      {/* Tiny Green Gained Score Badge */}
      <div className="flex flex-col items-end flex-shrink-0 gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-slate-400 hover:text-slate-600 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div
          className="px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-0.5"
          style={{
            background: "#DCFCE7",
            color: "#15803D",
            border: "1px solid #86EFAC",
          }}
        >
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span>+{gainedPoints} pts</span>
        </div>
      </div>
    </div>
  );
}
