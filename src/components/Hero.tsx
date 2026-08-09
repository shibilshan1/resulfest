"use client";

import Link from "next/link";
import { User, BarChart2, Star } from "lucide-react";
import { Team, Program } from "@/types";

interface HeroProps {
  onEnterMeet: () => void;
  teams?: Team[];
  programs?: Program[];
}

export function Hero({ onEnterMeet }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative w-full flex flex-col items-center justify-center text-center p-3 sm:p-6 overflow-hidden bg-white"
    >
      {/* Outer Card Container matching user's exact design */}
      <div
        className="relative w-full max-w-md sm:max-w-lg mx-auto rounded-3xl p-6 sm:p-10 border border-slate-100 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] flex flex-col items-center text-center space-y-6"
        style={{
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Top-Right Admin Quick Link */}
        <Link
          href="/admin"
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-semibold shadow-xs transition-all active:scale-95 z-10"
          title="Admin Portal"
        >
          <User className="w-3.5 h-3.5 text-[#1A56DB]" />
          <span>Admin</span>
        </Link>

        {/* Circular Logo Icon */}
        <div className="relative pt-2">
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-2 shadow-md border border-slate-100 flex items-center justify-center mx-auto transition-transform hover:scale-105"
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
            }}
          >
            <img
              src="/logo.png"
              alt="Kizil Elma Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* Title and Tagline */}
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm font-extrabold text-[#1A56DB] tracking-widest uppercase">
            NATIONAL TALENT MEET
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Kizil Elma
          </h1>
          <p className="text-base sm:text-lg font-semibold text-slate-700">
            Heading for the Ultimate Goal
          </p>
        </div>

        {/* Star Divider Line */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xs py-1">
          <div className="h-[1px] flex-1 bg-slate-300" />
          <Star className="w-4 h-4 text-[#1A56DB] fill-[#1A56DB]/20" />
          <div className="h-[1px] flex-1 bg-slate-300" />
        </div>

        {/* Official Application Subtext */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
            Official Results Application for
          </p>
          <p className="text-xs sm:text-sm font-black text-[#1E40AF] tracking-wide">
            AKMM COLLEGE LEVEL TALENTS MEET 2K26
          </p>
        </div>

        {/* VIEW RESULTS Pill Button */}
        <div className="pt-2 w-full flex justify-center">
          <button
            onClick={onEnterMeet}
            className="w-full max-w-xs sm:max-w-sm py-3.5 px-8 rounded-full bg-gradient-to-r from-[#0062D2] to-[#004BB0] hover:from-[#0056BA] hover:to-[#003D96] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <BarChart2 className="w-5 h-5 text-white stroke-[2.5]" />
            <span>VIEW RESULTS</span>
          </button>
        </div>
      </div>
    </section>
  );
}
