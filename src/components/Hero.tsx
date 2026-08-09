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
      className="relative w-full min-h-[calc(100dvh-70px)] flex flex-col items-center justify-between sm:justify-center text-center px-4 py-8 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-evenly text-center space-y-6 z-10">
        {/* Top Spacer for mobile balance */}
        <div className="pt-2" />

        {/* Circular Logo Icon with Glow */}
        <div className="relative">
          <div
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white p-2.5 shadow-xl border border-slate-100 flex items-center justify-center mx-auto transition-transform hover:scale-105"
            style={{
              boxShadow: "0 14px 35px rgba(0, 98, 210, 0.12)",
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
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Kizil Elma
          </h1>
          <p className="text-base sm:text-xl font-semibold text-slate-600">
            Heading for the Ultimate Goal
          </p>
        </div>

        {/* Star Divider Line */}
        <div className="flex items-center justify-center gap-4 w-full max-w-xs py-1">
          <div className="h-[1.5px] flex-1 bg-slate-200" />
          <Star className="w-4 h-4 text-[#0062D2] fill-[#0062D2]/20 stroke-[2]" />
          <div className="h-[1.5px] flex-1 bg-slate-200" />
        </div>

        {/* Official Application Subtext */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#0062D2] uppercase tracking-wider">
            Official Results Application for
          </p>
          <p className="text-xs sm:text-sm font-black text-[#1E40AF] tracking-wide uppercase">
            AKMM COLLEGE LEVEL TALENTS MEET 2K26
          </p>
        </div>

        {/* VIEW RESULTS Pill Button matching screenshot */}
        <div className="pt-4 w-full flex justify-center pb-4">
          <button
            onClick={onEnterMeet}
            className="w-full max-w-xs sm:max-w-sm py-4 px-8 rounded-full bg-gradient-to-r from-[#0062D2] to-[#004BB0] hover:from-[#0054BB] hover:to-[#003E99] text-white font-extrabold text-base tracking-wider uppercase shadow-xl shadow-blue-600/35 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <BarChart2 className="w-5 h-5 text-white stroke-[2.5]" />
            <span>VIEW RESULTS</span>
          </button>
        </div>
      </div>
    </section>
  );
}
