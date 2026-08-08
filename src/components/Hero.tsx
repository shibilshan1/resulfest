"use client";

import Link from "next/link";
import { User, BarChart2 } from "lucide-react";
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
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-between text-center px-4 pt-6 pb-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #dbe8fc 0%, #e8f2fd 45%, #f4f8fe 75%, #ffffff 100%)",
        color: "#1E293B",
      }}
    >
      {/* ── Top-Right Admin Button ── */}
      <div className="w-full max-w-5xl flex justify-end pt-2 pr-2 z-20">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-[#3b82f6] border border-[#d2e4ff] text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <User className="w-4 h-4 text-[#3b82f6]" />
          <span>Admin</span>
        </Link>
      </div>

      {/* ── Main Hero Content Container ── */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center my-auto pt-2 pb-6">
        {/* Large Official Logo Image (Includes Sun, Mountain, Camel, Kizil Elma & Subtitle) */}
        <div className="w-full max-w-[340px] sm:max-w-[420px] px-2 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Kizil Elma Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Decorative Star Line */}
        <div className="flex items-center justify-center gap-3 w-48 mx-auto mt-3 mb-4 opacity-70">
          <div className="h-[1px] flex-1 bg-[#b8d4f8]" />
          <span className="text-[#60a5fa] text-xs font-serif">✦</span>
          <div className="h-[1px] flex-1 bg-[#b8d4f8]" />
        </div>

        {/* Official Application Tagline */}
        <div className="space-y-1 text-center">
          <p className="text-xs sm:text-sm font-medium text-[#476a9f]">
            Official Results Application for
          </p>
          <h2 className="text-xs sm:text-sm font-extrabold text-[#2a4d80] tracking-wider uppercase">
            AKMM COLLEGE LEVEL TALENTS MEET 2K25
          </h2>
        </div>

        {/* VIEW RESULTS Action Button */}
        <div className="pt-6">
          <button
            onClick={onEnterMeet}
            className="px-8 py-3.5 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <BarChart2 className="w-5 h-5 text-white" />
            <span>VIEW RESULTS</span>
          </button>
        </div>
      </div>

      {/* Organic Bottom Wave Curves */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg
          className="relative block w-full h-24 sm:h-36"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,65 C650,170 900,10 1200,40 L1200,120 L0,120 Z"
            fill="#FFFFFF"
            fillOpacity="0.7"
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
