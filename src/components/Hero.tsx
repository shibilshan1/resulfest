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
      className="relative w-full flex flex-col items-center justify-center text-center p-2 sm:p-4 overflow-hidden bg-white"
    >
      {/* ── Outer Responsive Poster Container ── */}
      <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-100/60 bg-[#e8f1fd]">
        {/* Exact Uploaded Hero Image */}
        <img
          src="/hero-banner.png"
          alt="Kizil Elma 2K25 Talents Meet"
          className="w-full h-auto block object-cover"
        />

        {/* ── Interactive Overlay: Top-Right Admin Button ── */}
        <Link
          href="/admin"
          className="absolute top-[3.5%] right-[5%] inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-white/85 hover:bg-white text-[#3b82f6] border border-[#d2e4ff] text-xs font-semibold shadow-sm transition-all active:scale-95 z-20"
          title="Open Admin Portal"
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3b82f6]" />
          <span>Admin</span>
        </Link>

        {/* ── Interactive Overlay: VIEW RESULTS CTA Button ── */}
        <button
          onClick={onEnterMeet}
          className="absolute bottom-[22%] left-1/2 -translate-x-1/2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs sm:text-base tracking-wider uppercase shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20 z-20"
          title="Scroll to Scoreboard"
        >
          <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span>VIEW RESULTS</span>
        </button>
      </div>
    </section>
  );
}
