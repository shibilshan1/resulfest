"use client";

import { Award, Users, ArrowRight, Trophy, Sparkles, Activity } from "lucide-react";

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
  const handleOpenResults = () => {
    const element = document.getElementById("results");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      onEnterMeet();
    }
  };

  const handleOpenScoreboard = () => {
    const element = document.getElementById("scoreboard");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-8 sm:pb-12 animate-fadeIn"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
        {/* Left Column: Main Headlines & Actions */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* Fest Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0058bc] text-xs sm:text-sm font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#0058bc]" />
            <span>National Talent Meet 2K26</span>
          </div>

          {/* Main Title Heading */}
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-slate-900 font-black text-3xl sm:text-5xl lg:text-6xl leading-[1.1] uppercase tracking-tight">
              KIZIL ELMA Fest <br />
              <span className="text-[#0058bc] bg-gradient-to-r from-[#0058bc] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Live Score & Results
              </span>
            </h1>
            <p className="text-slate-600 font-bold text-base sm:text-xl lg:text-2xl tracking-tight pt-1">
              Heading for the Ultimate Goal
            </p>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              AKMM TALENTS MEET 2K26 • Official Realtime Scoreboard
            </p>
          </div>

          {/* Desktop/Mobile Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md lg:max-w-none justify-center lg:justify-start">
            <button
              onClick={handleOpenResults}
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#0058bc] hover:bg-[#004bb0] text-white font-extrabold text-base sm:text-lg shadow-[0_12px_24px_rgba(0,88,188,0.3)] hover:shadow-[0_14px_32px_rgba(0,88,188,0.45)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer border border-white/20"
            >
              <span>Open Result</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleOpenScoreboard}
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base sm:text-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-amber-500 stroke-[2.2]" />
              <span>Live Standings</span>
            </button>
          </div>

          {/* Live Status indicator */}
          <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Realtime Database Connected • System Live</span>
          </div>
        </div>

        {/* Right Column: Hero Visual Logo Card & Quick Stats Panel */}
        <div className="lg:col-span-5 mt-8 lg:mt-0 flex flex-col items-center">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_16px_40px_rgba(30,64,175,0.08)] flex flex-col items-center space-y-6 relative overflow-hidden">
            
            {/* Background Glow Overlay */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Kizil Elma Centered Logo */}
            <div className="relative z-10 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/60 shadow-xs">
              <img
                src="/logo.png"
                alt="Kizil Elma Logo"
                className="h-28 sm:h-36 md:h-40 w-auto object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Stats Cards (2-column inside hero card) */}
            <div className="grid grid-cols-2 gap-3 w-full relative z-10">
              {/* Programmes Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col items-center text-center space-y-1 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#fe9400]">
                  <Award className="w-5 h-5 stroke-[2.2]" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Programmes
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {programsCount.toLocaleString()}
                </p>
              </div>

              {/* Participants Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col items-center text-center space-y-1 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#0058bc]">
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Participants
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {participantsCount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quick Live Updates Badge */}
            <div className="w-full bg-blue-50/80 p-3 rounded-2xl border border-blue-100 flex items-center justify-between text-xs text-[#0058bc] font-bold relative z-10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0058bc] animate-pulse" />
                <span>Live Event Feed</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white text-[10px] uppercase font-black tracking-wide border border-blue-200 shadow-2xs">
                Auto Sync
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
