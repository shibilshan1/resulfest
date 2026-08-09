"use client";

import Link from "next/link";
import { Trophy, CalendarDays, Medal, User, Home, Menu, Search, MoreVertical } from "lucide-react";

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
    { id: "hero",         label: "Home",        icon: Home },
    { id: "scoreboard",   label: "Scoreboard",  icon: Trophy },
    { id: "results",      label: "Events",      icon: CalendarDays },
    { id: "check-points",  label: "Search",      icon: Search },
  ];

  return (
    <>
      {/* ── Top Header matching screenshot ── */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F1F5F9",
          boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
        }}
        className="sticky top-0 z-40 w-full px-4 py-3"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left: Hamburger menu + Title */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <button
              className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              title="Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
              Kizil Elma
            </h1>
          </div>

          {/* Right Header Actions: Round Profile Avatar & Admin */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0062D2] p-0.5 bg-white shadow-xs transition-transform hover:scale-105 flex items-center justify-center overflow-hidden"
              title="Admin Portal"
            >
              <img
                src="/logo.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Bottom Navigation Bar matching screenshot ── */}
      <nav
        className="bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 py-2 flex items-center justify-around bg-white border-t border-slate-100 shadow-lg"
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
                className="flex flex-col items-center justify-center py-1.5 px-5 rounded-full bg-[#0062D2] text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer border-0"
              >
                <Icon className="w-5 h-5 text-white stroke-[2.5]" />
                <span className="text-[10px] font-extrabold tracking-wide mt-0.5 text-white">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <Icon className="w-5 h-5 text-slate-500 stroke-[2]" />
              <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-slate-500">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
