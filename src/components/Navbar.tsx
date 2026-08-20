"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Trophy, Home, Menu, Award, Sparkles, Search } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [scrollActiveTab, setScrollActiveTab] = useState(activeTab);
  const isManualScrollRef = useRef(false);

  const scrollToSection = (tabId: string) => {
    isManualScrollRef.current = true;
    setActiveTab(tabId);
    setScrollActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Reset manual scroll flag after animation
    setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);
  };

  const handleSearchClick = () => {
    isManualScrollRef.current = true;
    setScrollActiveTab("check-points");
    const element = document.getElementById("check-points");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);
  };

  // IntersectionObserver to auto-update active tab when scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionIds = ["hero", "scoreboard", "results", "leaderboard", "gallery", "check-points"];
    const sectionMap: Record<string, string> = {
      "hero": "hero",
      "scoreboard": "scoreboard",
      "results": "results",
      "leaderboard": "leaderboard",
      "gallery": "gallery",
      "check-points": "check-points",
    };

    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }
          });

          if (isManualScrollRef.current) return;

          // Find the most visible section
          let maxRatio = 0;
          let maxId = "";
          visibleSections.forEach((ratio, sectionId) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              maxId = sectionId;
            }
          });

          if (maxId && sectionMap[maxId]) {
            setScrollActiveTab(sectionMap[maxId]);
          }
        },
        {
          threshold: [0, 0.1, 0.25, 0.5, 0.75],
          rootMargin: "-64px 0px -80px 0px", // Account for top header and bottom nav
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // The displayed active tab considers scroll position
  const displayActiveTab = scrollActiveTab;

  const navItems = [
    { id: "hero",       label: "Home",       icon: Home },
    { id: "results",    label: "Results",    icon: Award },
    { id: "scoreboard", label: "Scoreboard", icon: Trophy },
    { id: "gallery",    label: "Gallery",    icon: Sparkles },
  ];

  return (
    <>
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 w-full h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Left: Logo & Brand Title */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Kizil Elma Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#0058bc] tracking-tight leading-none">
                Kizil Elma
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                Talents Meet 2K26
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar (Visible on Desktop / Laptop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = displayActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-0 ${
                    isActive
                      ? "bg-[#0058bc] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => scrollToSection("leaderboard")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-0 ${
                displayActiveTab === "leaderboard"
                  ? "bg-[#0058bc] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${displayActiveTab === "leaderboard" ? "text-white" : "text-slate-500"}`} />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={handleSearchClick}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-0 ${
                displayActiveTab === "check-points"
                  ? "bg-[#0058bc] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Search className={`w-3.5 h-3.5 ${displayActiveTab === "check-points" ? "text-white" : "text-slate-500"}`} />
              <span>Search Rank</span>
            </button>
          </nav>

          {/* Right: Round Profile Avatar & Admin Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-xs"
            >
              <span>Admin Portal</span>
            </Link>

            <Link
              href="/admin"
              className="w-10 h-10 rounded-full border-2 border-[#60A5FA] p-0.5 bg-white shadow-xs transition-transform hover:scale-105 flex items-center justify-center overflow-hidden"
              title="Admin Portal"
            >
              <img
                src="/logo.png"
                alt="Admin Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navigation Bar (Hidden on Laptop md: screens) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-around bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] max-w-2xl mx-auto sm:bottom-3 sm:rounded-full sm:border sm:shadow-lg md:hidden"
        style={{
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = displayActiveTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer border-0 bg-transparent group"
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  isActive
                    ? "text-[#0058bc] stroke-[2.5] scale-110"
                    : "text-[#93C5FD] stroke-[2] group-hover:text-[#60A5FA]"
                }`}
              />
              <span
                className={`text-[10px] sm:text-[11px] tracking-tight mt-1 transition-colors duration-200 ${
                  isActive
                    ? "font-extrabold text-[#0058bc]"
                    : "font-semibold text-slate-500 group-hover:text-slate-700"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Search Button → scrolls to Check Points & Rank */}
        {(() => {
          const isActive = displayActiveTab === "check-points";
          return (
            <button
              onClick={handleSearchClick}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer border-0 bg-transparent group"
            >
              <Search
                className={`w-5 h-5 transition-colors duration-200 ${
                  isActive
                    ? "text-[#0058bc] stroke-[2.5] scale-110"
                    : "text-[#93C5FD] stroke-[2] group-hover:text-[#60A5FA]"
                }`}
              />
              <span
                className={`text-[10px] sm:text-[11px] tracking-tight mt-1 transition-colors duration-200 ${
                  isActive
                    ? "font-extrabold text-[#0058bc]"
                    : "font-semibold text-slate-500 group-hover:text-slate-700"
                }`}
              >
                Search
              </span>
            </button>
          );
        })()}
      </nav>
    </>
  );
}
