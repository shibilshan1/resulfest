"use client";

import { ListFilter, Users, ArrowRight, Zap } from "lucide-react";

interface HeroProps {
  onEnterMeet: () => void;
  programsCount?: number;
  participantsCount?: number;
}

export function Hero({
  onEnterMeet,
  programsCount = 24,
  participantsCount = 1240,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="w-full max-w-lg mx-auto px-4 pt-4 pb-12 space-y-6 animate-fadeIn"
    >
      {/* Hero Banner Section (AKMM TALENTS MEET 2K26) */}
      <div className="relative h-[360px] sm:h-[397px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 group">
        {/* Background Image / Artwork */}
        <div className="absolute inset-0 bg-[#F4F3F8] flex items-center justify-center p-6">
          <img
            src="/logo.png"
            alt="Kizil Elma Logo"
            className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

        {/* Banner Titles */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 space-y-1">
          <p className="text-white/80 text-[11px] font-black uppercase tracking-widest">
            National Talent Meet
          </p>
          <h2 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight leading-none drop-shadow-md">
            AKMM TALENTS MEET 2K26
          </h2>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="space-y-1.5 text-center px-2">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Heading for the Ultimate Goal
        </h3>
        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
          Step into the arena where national excellence meets tomorrow&apos;s leadership. Your session is prepared.
        </p>
      </div>

      {/* Session Detail Cards (Bento style grid with Dynamic Live Props) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Programs Card */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-1.5 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#fe9400]">
            <ListFilter className="w-5 h-5 stroke-[2.2]" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Programs
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {programsCount}
          </p>
        </div>

        {/* Participants Card */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-1.5 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#0058bc]">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Participants
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {participantsCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Action Button (Open Session) */}
      <div className="flex flex-col items-center pt-2 space-y-3">
        <button
          onClick={onEnterMeet}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#0070eb] to-[#0058bc] hover:from-[#0060cb] hover:to-[#0048a0] text-white font-extrabold text-lg sm:text-xl shadow-[0_12px_24px_rgba(0,88,188,0.3)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer border border-white/20"
        >
          <span>Open Session</span>
          <ArrowRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Ready for Induction</span>
        </p>
      </div>

      {/* Quick Status Card */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between border-l-4 border-l-[#fe9400]">
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-extrabold text-slate-900">
            Stage One Activation
          </p>
          <p className="text-[11px] font-semibold text-slate-500">
            Fine Arts &amp; Digital Innovation
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center text-[#fe9400] shrink-0">
          <Zap className="w-5 h-5 fill-[#fe9400]/20 stroke-[2.2]" />
        </div>
      </div>
    </section>
  );
}
