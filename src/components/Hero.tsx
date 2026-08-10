"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { Award, Users, ArrowRight, Trophy, ChevronDown } from "lucide-react";

interface HeroProps {
  onEnterMeet: () => void;
  programsCount?: number;
  participantsCount?: number;
}

/* ── Animation Variants ── */
const EASE_CUBIC = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_CUBIC },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: EASE_CUBIC },
  },
};

const logoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.7, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: EASE_CUBIC,
    },
  },
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6 + i * 0.12,
      duration: 0.7,
      ease: EASE_CUBIC,
    },
  }),
};

const staggerUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.7,
      ease: EASE_CUBIC,
    },
  },
});

const springIn = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
});

export function Hero({
  onEnterMeet,
  programsCount = 24,
  participantsCount = 1240,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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

  const handleScrollDown = () => {
    const scoreboard = document.getElementById("scoreboard");
    if (scoreboard) {
      scoreboard.scrollIntoView({ behavior: "smooth" });
    }
  };

  const headingWords = ["Kizil", "Elma"];
  const mottoText = "Heading for the Ultimate Goal";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-premium"
    >
      {/* ── Background Decorative Orbs ── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Top-right warm orb */}
        <div
          className="hero-orb hero-orb--warm"
          style={{
            width: "500px",
            height: "500px",
            top: "-10%",
            right: "-5%",
          }}
        />
        {/* Bottom-left cream orb */}
        <div
          className="hero-orb hero-orb--cream"
          style={{
            width: "600px",
            height: "600px",
            bottom: "-15%",
            left: "-10%",
          }}
        />
        {/* Center gold orb */}
        <div
          className="hero-orb hero-orb--gold"
          style={{
            width: "400px",
            height: "400px",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </motion.div>

      {/* Grain texture */}
      <div className="hero-grain" />

      {/* ── Main Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          maxWidth: "900px",
          width: "100%",
          gap: 0,
        }}
      >
        {/* ── Logo ── */}
        <motion.div
          variants={logoReveal}
          style={{
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "32px",
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(212,165,116,0.15)",
              boxShadow: "0 16px 60px rgba(61,43,31,0.08)",
              display: "inline-block",
            }}
          >
            <img
              src="/logo.png"
              alt="Kizil Elma Logo"
              style={{
                height: "clamp(100px, 18vw, 180px)",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </motion.div>

        {/* ── Heading: "Kizil Elma" ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(12px, 3vw, 24px)",
            flexWrap: "wrap",
            marginBottom: "12px",
          }}
        >
          {headingWords.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              variants={wordReveal}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="hero-title"
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 900,
                fontSize: "4.5rem",
                lineHeight: 1.05,
                color: "var(--color-hero-text)",
                letterSpacing: "-0.03em",
                display: "inline-block",
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* ── Warm accent divider ── */}
        <motion.hr
          className="hero-divider"
          variants={staggerUp(0.9)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ marginBottom: "16px" }}
        />

        {/* ── Motto ── */}
        <motion.p
          className="hero-motto"
          variants={staggerUp(1.0)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            fontFamily: "var(--font-headline)",
            fontWeight: 600,
            fontSize: "1.5rem",
            color: "var(--color-hero-muted)",
            letterSpacing: "-0.01em",
            marginBottom: "8px",
            lineHeight: 1.4,
          }}
        >
          {mottoText}
        </motion.p>

        {/* ── Subtitle ── */}
        <motion.p
          className="hero-subtitle"
          variants={staggerUp(1.15)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            fontFamily: "var(--font-headline)",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "var(--color-warm-accent)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          AKMM College Level Talents Meet 2K26
        </motion.p>

        {/* ── Stats Cards ── */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "36px",
            width: "100%",
            maxWidth: "440px",
          }}
        >
          <motion.div
            className="hero-stat-card"
            variants={springIn(1.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ flex: "1 1 180px", minWidth: "140px" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "rgba(245,158,11,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <Award
                style={{ width: "22px", height: "22px", color: "#D4A574" }}
                strokeWidth={2.2}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 800,
                fontSize: "2rem",
                color: "var(--color-hero-text)",
                lineHeight: 1,
                marginBottom: "2px",
              }}
            >
              {programsCount.toLocaleString()}
            </p>
            <p
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 600,
                fontSize: "0.7rem",
                color: "var(--color-hero-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Programmes
            </p>
          </motion.div>

          <motion.div
            className="hero-stat-card"
            variants={springIn(1.55)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ flex: "1 1 180px", minWidth: "140px" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "rgba(61,43,31,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <Users
                style={{ width: "22px", height: "22px", color: "#3D2B1F" }}
                strokeWidth={2.2}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 800,
                fontSize: "2rem",
                color: "var(--color-hero-text)",
                lineHeight: 1,
                marginBottom: "2px",
              }}
            >
              {participantsCount.toLocaleString()}
            </p>
            <p
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 600,
                fontSize: "0.7rem",
                color: "var(--color-hero-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Participants
            </p>
          </motion.div>
        </div>

        {/* ── CTA Buttons ── */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "480px",
            marginBottom: "16px",
          }}
        >
          <motion.button
            className="hero-btn-primary"
            variants={springIn(1.7)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenResults}
          >
            <span>View Results</span>
            <ArrowRight style={{ width: "18px", height: "18px" }} strokeWidth={2.5} />
          </motion.button>

          <motion.button
            className="hero-btn-secondary"
            variants={springIn(1.85)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenScoreboard}
          >
            <Trophy style={{ width: "18px", height: "18px", color: "#D4A574" }} strokeWidth={2.2} />
            <span>Live Standings</span>
          </motion.button>
        </div>

        {/* ── Live indicator ── */}
        <motion.div
          variants={staggerUp(2.0)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-hero-muted)",
            marginBottom: "8px",
          }}
        >
          <span style={{ position: "relative", display: "flex", width: "10px", height: "10px" }}>
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#22C55E",
                opacity: 0.6,
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
          </span>
          <span>Realtime • System Live</span>
        </motion.div>
      </motion.div>

      {/* ── Scroll Down Indicator ── */}
      <motion.div
        variants={staggerUp(2.3)}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="hero-scroll-indicator"
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
        onClick={handleScrollDown}
      >
        <span
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "var(--color-hero-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            opacity: 0.7,
          }}
        >
          Explore
        </span>
        <ChevronDown
          style={{ width: "20px", height: "20px", color: "var(--color-warm-accent)" }}
          strokeWidth={2.5}
        />
      </motion.div>

      {/* Ping keyframes for live dot */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
