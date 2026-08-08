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
    { id: "hero",        label: "Home",        icon: Home },
    { id: "scoreboard",  label: "Scoreboard",  icon: Trophy },
    { id: "results",     label: "Events",      icon: CalendarDays },
    { id: "check-points", label: "Search",      icon: Search },
  ];

  return (
    <>
      {/* ── Top Header ── */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #E4EAF4",
          boxShadow: "0 2px 12px rgba(30,64,175,0.06)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
        className="sticky top-0 z-50 w-full px-5 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand with Official Logo PNG */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="Kizil Elma 2K26"
              style={{
                height: 40,
                width: "auto",
                objectFit: "contain",
              }}
            />
            <div className="flex flex-col">
              <h1
                style={{
                  color: "#1A56DB",
                  fontWeight: 900,
                  fontSize: "20px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                }}
              >
                Kizil&nbsp;Elma
              </h1>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                TALENTS MEET 2K26
              </span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  color: activeTab === item.id ? "#1A56DB" : "#6B7280",
                  fontWeight: activeTab === item.id ? 700 : 500,
                  fontSize: "14px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: activeTab === item.id ? "2px solid #1A56DB" : "2px solid transparent",
                  paddingBottom: "2px",
                  background: "none",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Header Actions: Admin link & 3-Dots Menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1A56DB, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(26,86,219,0.3)",
              }}
              title="Admin Portal"
            >
              <User className="w-4 h-4 text-white" />
            </Link>
            <button
              onClick={() => scrollToSection("scoreboard")}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Bottom Navigation (Mobile Tab Bar) ── */}
      <nav
        className="bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-2 flex items-center justify-around"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #E4EAF4",
          boxShadow: "0 -4px 20px rgba(30, 64, 175, 0.12)",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex flex-col items-center gap-1 py-1 px-3"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: isActive ? "#1A56DB" : "#9CA3AF",
                  transition: "color 0.2s",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#1A56DB" : "#9CA3AF",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
