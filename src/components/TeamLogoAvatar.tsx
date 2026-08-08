"use client";

import React from "react";
import { Team } from "@/types";

interface TeamLogoAvatarProps {
  team: Pick<Team, "name" | "color"> & { logo_url?: string };
  size?: number;
  borderRadius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function TeamLogoAvatar({
  team,
  size = 40,
  borderRadius = 12,
  className = "",
  style = {},
}: TeamLogoAvatarProps) {
  const hasCustomLogo = Boolean(
    team.logo_url &&
      team.logo_url.trim() !== "" &&
      !team.logo_url.includes("dicebear.com/7.x/identicon")
  );

  const isLight =
    team.color?.toLowerCase() === "#ffffff" ||
    team.color?.toLowerCase() === "#fff" ||
    team.color?.toLowerCase() === "white";

  const textColor = isLight ? "#0F172A" : "#FFFFFF";
  const initial = team.name ? team.name.trim().charAt(0).toUpperCase() : "T";

  if (hasCustomLogo) {
    return (
      <img
        src={team.logo_url}
        alt={team.name}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius,
          objectFit: "cover",
          border: isLight ? "2px solid #CBD5E1" : "2px solid rgba(255,255,255,0.25)",
          background: "#FFFFFF",
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: team.color || "#3B82F6",
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: Math.max(12, Math.round(size * 0.45)),
        letterSpacing: "-0.02em",
        border: isLight ? "2px solid #CBD5E1" : "2px solid rgba(255,255,255,0.3)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        flexShrink: 0,
        userSelect: "none",
        ...style,
      }}
      title={team.name}
    >
      {initial}
    </div>
  );
}
