"use client";

import { Clock, Users, ArrowRight } from "lucide-react";

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
      className="w-full max-w-lg mx-auto px-4 pt-6 pb-10 space-y-6 animate-fadeIn text-center"
    >
      {/* Centered Logo & Main Title Section */}
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        {/* Centered Kizil Elma Logo */}
        <div className="mb-2 flex justify-center">
          <img
            src="/logo.png"
            alt="Kizil Elma Logo"
            className="h-24 sm:h-28 w-auto object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Subtitle */}
        <p className="text-[#0058bc] text-xs sm:text-sm font-black uppercase tracking-widest">
          National Talent Meet
        </p>

        {/* Main Display Heading */}
        <h2 className="text-slate-900 font-black text-2xl sm:text-4xl leading-tight uppercase tracking-tight">
          KIZIL ELMA Fest <br />
          <span className="text-[#0058bc]">— Live Score</span>
        </h2>
      </div>

      {/* Welcome Text */}
      <div className="space-y-1 text-center px-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Heading for the Ultimate Goal
        </h3>
        <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wide max-w-sm mx-auto">
          AKMM TALENTS MEET 2K26
        </p>
      </div>

      {/* Session Detail Cards (Bento Style Grid matching exact reference HTML) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Estimated Time Card */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-1 hover:shadow-md transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#fe9400]">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Time
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            45 Min
          </p>
        </div>

        {/* Participants Card (Live Dynamic Count) */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-1 hover:shadow-md transition-all">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#0058bc]">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Participants
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {participantsCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Action Button (Open Result) */}
      <div className="flex flex-col items-center pt-2 space-y-3">
        <button
          onClick={onEnterMeet}
          className="w-full py-4 px-8 rounded-full bg-[#0058bc] hover:bg-[#004bb0] text-white font-extrabold text-lg sm:text-xl shadow-[0_12px_24px_rgba(0,88,188,0.3)] hover:shadow-[0_12px_32px_rgba(0,88,188,0.5)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer border border-white/20"
        >
          <span>Open Result</span>
          <ArrowRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Ready for Induction</span>
        </p>
      </div>
    </section>
  );
}
