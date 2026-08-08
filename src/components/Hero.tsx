"use client";

import { useState, useEffect } from "react";
import { Team, Program } from "@/types";
import { ChevronDown, Trophy, Zap, Shield, Flame, Radio } from "lucide-react";

interface HeroProps {
  onEnterMeet: () => void;
  teams?: Team[];
  programs?: Program[];
}

export function Hero({ onEnterMeet, teams = [], programs = [] }: HeroProps) {
  const [mounted, setMounted] = useState(false);

  const sortedTeams = [...teams].sort((a, b) => b.total_score - a.total_score);
  const leadingTeam = sortedTeams[0];
  const leadingText = leadingTeam
    ? `${leadingTeam.name} (${leadingTeam.total_score} pts)`
    : "Live Competition";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 20%, #1a0408 0%, #0d0614 45%, #05070e 100%)",
        color: "#ffffff",
        padding: "44px 16px 32px",
      }}
    >
      {/* ── Layer 1: Futuristic Background Grid & Light Flares ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(239, 68, 68, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(239, 68, 68, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Red Ambient Orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "550px",
          height: "280px",
          background: "radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, rgba(220, 38, 38, 0.12) 50%, transparent 80%)",
          filter: "blur(65px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Content Box */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 920,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 18,
        }}
      >
        {/* Top Fest Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 18px",
            borderRadius: 999,
            background: "rgba(255, 0, 0, 0.12)",
            border: "1px solid rgba(255, 50, 50, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <Radio style={{ width: 14, height: 14, color: "#FF0000" }} className="yt-radio-pulse" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: "#FFD1D7",
              textTransform: "uppercase",
            }}
          >
            AKMM TALENTS MEET 2K26 • REAL-TIME STANDINGS
          </span>
        </div>

        {/* Hero Title & YouTube Style LIVE SCORE */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 76px)",
              fontWeight: 950,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              margin: 0,
              textTransform: "uppercase",
              color: "#FFFFFF",
              textShadow: "0 4px 24px rgba(0,0,0,0.9)",
            }}
          >
            KIZIL ELMA
          </h1>

          {/* YouTube Realistic LIVE Badge + SCORE */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {/* Realistic YouTube Live Badge Box */}
            <div
              className="yt-live-badge-box"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#FF0000",
                color: "#FFFFFF",
                padding: "6px 18px",
                borderRadius: 999,
                fontWeight: 900,
                fontSize: "clamp(22px, 4vw, 38px)",
                letterSpacing: "0.08em",
                lineHeight: 1,
                boxShadow: "0 0 25px rgba(255, 0, 0, 0.8), 0 4px 12px rgba(0,0,0,0.5)",
                textTransform: "uppercase",
                position: "relative",
              }}
            >
              <span className="yt-live-pulse-dot" />
              <span>LIVE</span>
            </div>

            {/* SCORE Text */}
            <span
              style={{
                fontSize: "clamp(32px, 5.5vw, 58px)",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textShadow: "0 0 30px rgba(255,255,255,0.4)",
              }}
            >
              SCORE 2K26
            </span>
          </div>
        </div>

        {/* ── Optical Open Button ── */}
        <div style={{ marginTop: 6, position: "relative" }}>
          <button
            onClick={onEnterMeet}
            className="optical-open-btn"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "14px 38px",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "linear-gradient(135deg, rgba(255, 0, 0, 0.95) 0%, rgba(220, 38, 38, 0.95) 50%, rgba(185, 28, 28, 1) 100%)",
              border: "1.5px solid rgba(255, 180, 190, 0.6)",
              borderRadius: 999,
              cursor: "pointer",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: `
                0 0 25px rgba(255, 0, 0, 0.6),
                inset 0 2px 4px rgba(255, 255, 255, 0.5),
                inset 0 -3px 8px rgba(0, 0, 0, 0.4)
              `,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              <Trophy style={{ width: 16, height: 16, color: "#FFF" }} />
            </span>

            <span>OPEN LIVE SCOREBOARD</span>

            <ChevronDown style={{ width: 20, height: 20, color: "#FFD1D7" }} />
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            flexWrap: "wrap",
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 20,
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Flame style={{ width: 16, height: 16, color: "#FF0000" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>Leading Team:</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#FCA5A5" }}>{leadingText}</span>
          </div>

          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap style={{ width: 16, height: 16, color: "#F59E0B" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>Events Listed:</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#FDE047" }}>{programs.length} Programs</span>
          </div>

          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield style={{ width: 16, height: 16, color: "#3B82F6" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>{teams.length || 4} Houses Competing</span>
          </div>
        </div>
      </div>

      {/* YouTube Style Embedded CSS Animations */}
      <style>{`
        .yt-live-pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FFFFFF;
          display: inline-block;
        }

        .yt-live-badge-box {
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 4px 10px rgba(0,0,0,0.4);
        }

        .optical-open-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 
            0 0 50px rgba(255, 0, 0, 0.85),
            0 0 20px rgba(255, 255, 255, 0.4),
            inset 0 2px 6px rgba(255, 255, 255, 0.8);
          border-color: #FFFFFF;
        }

        .optical-open-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
    </section>
  );
}
