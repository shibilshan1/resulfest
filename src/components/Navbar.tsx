"use client";

import Link from "next/link";
import { Trophy, Home, Menu, Award, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const scrollToSection = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "hero",       label: "Home",       icon: Home },
    { id: "results",    label: "Stage",      icon: Award },
    { id: "scoreboard", label: "Scoreboard", icon: Trophy },
    { id: "gallery",    label: "Gallery",    icon: Sparkles },
  ];

  return (
    <>
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 w-full h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          {/* Left: Menu + Title */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <button
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              title="Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.2] text-[#0058bc]" />
            </button>

            <h1 className="text-xl sm:text-2xl font-black text-[#0058bc] tracking-tight leading-none">
              Kizil Elma
            </h1>
          </div>

          {/* Right: Round Profile Avatar & Admin Link */}
          <Link
            href="/admin"
            className="w-10 h-10 rounded-full border-2 border-[#0070eb] p-0.5 bg-white shadow-xs transition-transform hover:scale-105 flex items-center justify-center overflow-hidden"
            title="Admin Portal"
          >
            <img
              src="/logo.png"
              alt="Admin Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </Link>
        </div>
      </header>

      {/* ── Bottom Navigation Bar (No Profile, Clean Backdrop Blur & Shading, Search Points/Rank) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 px-3 py-2 flex items-center justify-around bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
        style={{
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-gradient-to-r from-[#0070eb] to-[#0058bc] text-white shadow-md shadow-blue-600/25 transition-all cursor-pointer border-0"
              >
                <Icon className="w-4 h-4 text-white stroke-[2.5]" />
                <span className="text-xs font-bold tracking-wide text-white">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3.5 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <Icon className="w-5 h-5 text-slate-500 stroke-[2]" />
              <span className="text-[11px] font-semibold tracking-tight mt-0.5 text-slate-500">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
