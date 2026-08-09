"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useFestStore } from "@/lib/store";
import { Team, Student, Result, Program } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Scoreboard } from "@/components/Scoreboard";
import { ResultsAccordion } from "@/components/ResultsAccordion";
import { Leaderboard } from "@/components/Leaderboard";
import { CheckYourPointsRank } from "@/components/CheckYourPointsRank";
import { TeamDetailModal } from "@/components/TeamDetailModal";
import { LiveResultPopup } from "@/components/LiveResultPopup";
import { StudentPointsModal } from "@/components/StudentPointsModal";
import { ImageSlideshow } from "@/components/ImageSlideshow";
import Link from "next/link";

interface AppHistoryState {
  tab: string;
  teamId: string | null;
  showAllPrograms: boolean;
  showAllStudents: boolean;
  expandedProgramId: string | null;
  expandedStudentId?: string | null;
  expandedCheckStudentId?: string | null;
  checkQuery?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("hero");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [activeLivePopupResult, setActiveLivePopupResult] = useState<Result | null>(null);
  const [activePopupStudent, setActivePopupStudent] = useState<Student | null>(null);

  const {
    teams,
    students,
    programs,
    results,
    slideshowImages,
    isLoading,
    isConfigured,
    getScoreProgressionData,
  } = useFestStore();

  // Auto trigger a live result popup when results exist
  useEffect(() => {
    if (!isLoading && results.length > 0 && students.length > 0 && !activeLivePopupResult) {
      const topResult = results.find((r) => r.position === 1 && (r.points_awarded || 0) > 0) || results[0];
      if (topResult) {
        setActiveLivePopupResult(topResult);
      }
    }
  }, [isLoading, results, students]);

  const isPopStateRef = useRef(false);
  const initialTeamIdRef = useRef<string | null>(null);
  const teamsRef = useRef(teams);

  useEffect(() => {
    teamsRef.current = teams;
  }, [teams]);

  const pushNavState = useCallback(
    (
      tab: string,
      teamId: string | null,
      allProgs: boolean,
      allStuds: boolean,
      expProgId: string | null = null
    ) => {
      if (isPopStateRef.current || typeof window === "undefined") return;

      const stateObj: AppHistoryState = {
        tab,
        teamId,
        showAllPrograms: allProgs,
        showAllStudents: allStuds,
        expandedProgramId: expProgId,
      };

      if (
        window.history.state?.tab === tab &&
        window.history.state?.teamId === teamId &&
        window.history.state?.showAllPrograms === allProgs &&
        window.history.state?.showAllStudents === allStuds &&
        window.history.state?.expandedProgramId === expProgId
      ) {
        return;
      }

      window.history.pushState(stateObj, "", window.location.pathname + window.location.search);
    },
    []
  );

  // Initialize history state ONCE on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    let initialTab = "hero";
    let initialTeamId: string | null = null;
    let initialAllProgs = false;
    let initialAllStuds = false;
    let initialProgId: string | null = null;

    if (hash.startsWith("#team-")) {
      initialTeamId = hash.replace("#team-", "");
      initialTab = "scoreboard";
    } else if (hash.startsWith("#program-")) {
      initialProgId = hash.replace("#program-", "");
      initialTab = "results";
    } else if (hash === "#all-programs") {
      initialAllProgs = true;
      initialTab = "results";
    } else if (hash === "#all-students") {
      initialAllStuds = true;
      initialTab = "leaderboard";
    } else if (["#hero", "#results", "#scoreboard", "#leaderboard"].includes(hash)) {
      initialTab = hash.substring(1);
    }

    initialTeamIdRef.current = initialTeamId;

    const initialState: AppHistoryState = {
      tab: initialTab,
      teamId: initialTeamId,
      showAllPrograms: initialAllProgs,
      showAllStudents: initialAllStuds,
      expandedProgramId: initialProgId,
    };

    if (!window.history.state) {
      window.history.replaceState(
        initialState,
        "",
        window.location.pathname + window.location.search
      );
    }
    setActiveTab(initialTab);
    setShowAllPrograms(initialAllProgs);
    setShowAllStudents(initialAllStuds);
    setExpandedProgramId(initialProgId);
  }, []);

  // Sync initialTeamId when teams data finishes loading
  useEffect(() => {
    if (initialTeamIdRef.current && teams.length > 0) {
      const found = teams.find((t) => t.id === initialTeamIdRef.current);
      if (found) {
        setSelectedTeam(found);
        initialTeamIdRef.current = null;
      }
    }
  }, [teams]);

  // Handle mobile back button & browser popstate events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = (event: PopStateEvent) => {
      isPopStateRef.current = true;
      const state: AppHistoryState | null = event.state;
      const currentTeams = teamsRef.current;

      if (state) {
        setShowAllPrograms(!!state.showAllPrograms);
        setShowAllStudents(!!state.showAllStudents);
        setExpandedProgramId(state.expandedProgramId || null);

        if (state.teamId) {
          const found = currentTeams.find((t) => t.id === state.teamId);
          setSelectedTeam(found || null);
        } else {
          setSelectedTeam(null);
        }

        if (state.tab) {
          setActiveTab(state.tab);
        }
      } else {
        // Popstate with null state: gracefully close modal and subviews without scrolling to top or resetting
        setSelectedTeam(null);
        setShowAllPrograms(false);
        setShowAllStudents(false);
        setExpandedProgramId(null);
      }

      setTimeout(() => {
        isPopStateRef.current = false;
      }, 50);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);



  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedTeam(null);
    setExpandedProgramId(null);
    pushNavState(tab, null, showAllPrograms, showAllStudents, null);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectTeam = (team: Team | null) => {
    if (team) {
      setSelectedTeam(team);
      pushNavState(activeTab, team.id, showAllPrograms, showAllStudents, expandedProgramId);
    } else {
      handleCloseTeamModal();
    }
  };

  const handleCloseTeamModal = () => {
    if (selectedTeam) {
      setSelectedTeam(null);
      if (typeof window !== "undefined" && window.history.state?.teamId) {
        window.history.back();
      } else {
        pushNavState(activeTab, null, showAllPrograms, showAllStudents, expandedProgramId);
      }
    }
  };

  const handleSetShowAllPrograms = (val: boolean) => {
    setShowAllPrograms(val);
    if (val) {
      pushNavState("results", selectedTeam?.id || null, true, showAllStudents, expandedProgramId);
    } else {
      if (typeof window !== "undefined" && window.history.state?.showAllPrograms) {
        window.history.back();
      } else {
        pushNavState("results", selectedTeam?.id || null, false, showAllStudents, expandedProgramId);
      }
    }
  };

  const handleSetShowAllStudents = (val: boolean) => {
    setShowAllStudents(val);
    if (val) {
      pushNavState("leaderboard", selectedTeam?.id || null, showAllPrograms, true, expandedProgramId);
    } else {
      if (typeof window !== "undefined" && window.history.state?.showAllStudents) {
        window.history.back();
      } else {
        pushNavState("leaderboard", selectedTeam?.id || null, showAllPrograms, false, expandedProgramId);
      }
    }
  };

  const handleSetExpandedProgramId = (progId: string | null) => {
    setExpandedProgramId(progId);
    if (progId) {
      pushNavState("results", selectedTeam?.id || null, showAllPrograms, showAllStudents, progId);
    } else {
      if (typeof window !== "undefined" && window.history.state?.expandedProgramId) {
        window.history.back();
      } else {
        pushNavState("results", selectedTeam?.id || null, showAllPrograms, showAllStudents, null);
      }
    }
  };

  const handleEnterMeet = () => {
    handleTabChange("scoreboard");
  };

  const scoreProgression = getScoreProgressionData();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "#070A14",
          color: "#fff",
        }}
      >
        <img
          src="/logo.png"
          alt="Kizil Elma 2K26"
          style={{
            maxHeight: 120,
            maxWidth: "80vw",
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
          }}
        />
        <div className="loading-spinner" />
        <p style={{ color: "#93C5FD", fontWeight: 700, fontSize: 15 }}>
          Loading Kizil Elma 2K26…
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0F4FA",
        color: "#111827",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {!isConfigured && (
        <div
          style={{
            background: "#FEF2F2",
            borderBottom: "1px solid #FCA5A5",
            color: "#991B1B",
            padding: "12px 16px",
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ⚠️ Firebase environment variables are not configured in <code>.env.local</code>. Please set <code>NEXT_PUBLIC_FIREBASE_API_KEY</code> and <code>NEXT_PUBLIC_FIREBASE_PROJECT_ID</code> to enable live updates across all devices.
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, paddingBottom: 80 }}>
        <Hero onEnterMeet={handleEnterMeet} teams={teams} programs={programs} />
        <Scoreboard
          teams={teams}
          scoreProgression={scoreProgression}
          onSelectTeam={handleSelectTeam}
        />
        <ResultsAccordion
          programs={programs}
          results={results}
          students={students}
          teams={teams}
          showAllPrograms={showAllPrograms}
          setShowAllPrograms={handleSetShowAllPrograms}
          expandedProgramId={expandedProgramId}
          setExpandedProgramId={handleSetExpandedProgramId}
        />
        <Leaderboard
          students={students}
          teams={teams}
          results={results}
          programs={programs}
          showAllStudents={showAllStudents}
          setShowAllStudents={handleSetShowAllStudents}
        />
        <ImageSlideshow images={slideshowImages} />
      </main>

      {/* Team Detail Modal */}
      <TeamDetailModal
        team={selectedTeam}
        students={students}
        programs={programs}
        results={results}
        onClose={handleCloseTeamModal}
      />

      {/* Footer */}
      <footer
        style={{
          background: "#fff",
          borderTop: "1px solid #E4EAF4",
          padding: "28px 16px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <img
            src="/logo.png"
            alt="Kizil Elma Logo"
            style={{
              height: 54,
              width: "auto",
              objectFit: "contain",
            }}
          />
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0, fontWeight: 500 }}>
            AKMM College Level Talents Meet 2K26 • Heading for the Ultimate Goal
          </p>
          <div style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>Powered by Next.js & Firebase Realtime Database</span>
            <span>•</span>
            <Link
              href="/admin"
              style={{ color: "#1A56DB", fontWeight: 600 }}
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* Live Game-Style Result Notification Popup (1 second per student order) */}
      {results && results.length > 0 && (
        <LiveResultPopup
          results={results}
          students={students}
          teams={teams}
          programs={programs}
          onOpenFullModal={(stud) => setActivePopupStudent(stud)}
        />
      )}

      {/* Full Student Points Breakdown Modal */}
      <StudentPointsModal
        student={activePopupStudent}
        teams={teams}
        programs={programs}
        results={results}
        allStudents={students}
        onClose={() => setActivePopupStudent(null)}
      />
    </div>
  );
}
