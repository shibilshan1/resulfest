"use client";

import Link from "next/link";
import { User, BarChart2, Sparkles } from "lucide-react";
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
      className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #E6F0FA 0%, #F4F8FD 45%, #FFFFFF 100%)",
        color: "#1E293B",
      }}
    >
      {/* ── Top-Right Admin Button ── */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-[#1A56DB] text-xs font-bold shadow-md shadow-blue-900/5 border border-blue-100 backdrop-blur-md transition-all active:scale-95"
        >
          <User className="w-4 h-4 text-[#1A56DB]" />
          <span>Admin</span>
        </Link>
      </div>

      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center gap-5 my-auto">
        {/* Large Official Logo Image */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] px-4 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Kizil Elma Logo"
            className="w-full h-auto object-contain filter drop-shadow-md"
          />
        </div>

        {/* Subtitle text */}
        <p className="text-base sm:text-xl font-medium text-slate-700 font-serif tracking-wide m-0">
          Heading for the Ultimate Goal
        </p>

        {/* Decorative Star Line */}
        <div className="flex items-center justify-center gap-3 w-48 mx-auto my-1 opacity-70">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-400/60" />
          <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-400/60" />
        </div>

        {/* Official Application Tagline */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
            Official Results Application for
          </p>
          <h2 className="text-xs sm:text-sm font-extrabold text-[#1E3A8A] tracking-wider uppercase">
            AKMM COLLEGE LEVEL TALENTS MEET 2K25
          </h2>
        </div>

        {/* VIEW RESULTS Action Button */}
        <div className="pt-3">
          <button
            onClick={onEnterMeet}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
          >
            <BarChart2 className="w-5 h-5 text-white" />
            <span>VIEW RESULTS</span>
          </button>
        </div>
      </div>

      {/* Organic Bottom Wave Curves */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg
          className="relative block w-full h-16 sm:h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,65 C650,170 900,10 1200,40 L1200,120 L0,120 Z"
            fill="#FFFFFF"
            fillOpacity="0.8"
          />
          <path
            d="M0,30 C200,100 450,10 700,80 C950,150 1100,40 1200,60 L1200,120 L0,120 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
