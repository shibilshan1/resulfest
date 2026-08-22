"use client";

import { useState, useEffect, useMemo } from "react";
import { Team, Student, Program, Result, ScoreProgressionPoint, SlideshowImage } from "@/types";
import {
  INITIAL_TEAMS,
  INITIAL_STUDENTS,
  INITIAL_PROGRAMS,
  INITIAL_RESULTS,
  INITIAL_SLIDESHOW_IMAGES,
  UNKNOWN_PERSON_AVATAR,
} from "./mockData";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

const getLocalItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const cached = localStorage.getItem(key);
    return cached ? (JSON.parse(cached) as T) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalItem = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage:`, e);
  }
};

export function useFestStore() {
  const [rawTeams, setRawTeams] = useState<Team[]>([]);
  const [rawStudents, setRawStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [slideshowImages, setSlideshowImages] = useState<SlideshowImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Data loading & Firebase Realtime Listeners ────────────────────
  useEffect(() => {
    // 1. Initial hydration from LocalStorage (or initial mock fallback)
    const initialTeams = getLocalItem("kizilelma_teams", INITIAL_TEAMS);
    const initialStudents = getLocalItem("kizilelma_students", INITIAL_STUDENTS);
    const initialPrograms = getLocalItem("kizilelma_programs", INITIAL_PROGRAMS);
    const initialResults = getLocalItem("kizilelma_results", INITIAL_RESULTS);
    const initialSlideshow = getLocalItem("kizilelma_slideshow_images", INITIAL_SLIDESHOW_IMAGES);

    setRawTeams(initialTeams);
    setRawStudents(initialStudents);
    setPrograms(initialPrograms);
    setResults(initialResults);
    setSlideshowImages(initialSlideshow);

    if (!db || !isFirebaseConfigured) {
      console.warn("Firebase is not configured. Running in LocalStorage Backup Mode.");
      setIsLoading(false);
      return;
    }

    const database = db;

    let teamsLoaded = false;
    let studentsLoaded = false;
    let programsLoaded = false;
    let resultsLoaded = false;

    const checkFullyLoaded = () => {
      if (teamsLoaded && studentsLoaded && programsLoaded && resultsLoaded) {
        setIsLoading(false);
      }
    };

    // Helper to normalize team branding
    const normalizeTeam = (t: Team): Team => {
      let name = t.name;
      let color = t.color || "#3B82F6";
      let logo_url = t.logo_url || "";

      if (t.id === "team-a" || t.name.toLowerCase().includes("group a") || t.name.toLowerCase().includes("quba")) {
        name = t.name || "QUBA";
        color = t.color || "#FFFFFF";
      } else if (t.id === "team-b" || t.name.toLowerCase().includes("group b") || t.name.toLowerCase().includes("juhfa")) {
        name = t.name || "JUHFA";
        color = t.color || "#38BDF8";
      } else if (t.id === "team-c" || t.name.toLowerCase().includes("group c") || t.name.toLowerCase().includes("khudyd")) {
        name = t.name || "KHUDYD";
        color = t.color || "#EF4444";
      } else if (t.id === "team-d" || t.name.toLowerCase().includes("group d") || t.name.toLowerCase().includes("thawr")) {
        name = t.name || "THAWR";
        color = t.color || "#10B981";
      }

      return { ...t, name, color, logo_url };
    };

    // 1. Teams listener
    const unsubTeams = onSnapshot(
      collection(database, "teams"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!snapshot.empty) {
          const loadedTeams = snapshot.docs.map((docSnap) => {
            const raw = docSnap.data() as Team;
            return normalizeTeam(raw);
          });
          setRawTeams(loadedTeams);
          setLocalItem("kizilelma_teams", loadedTeams);
        }
        teamsLoaded = true;
        checkFullyLoaded();
      },
      (err: unknown) => {
        console.error("Teams listener error:", err);
        teamsLoaded = true;
        checkFullyLoaded();
      }
    );

    // 2. Students listener
    const unsubStudents = onSnapshot(
      collection(database, "students"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!snapshot.empty) {
          const loadedStudents = snapshot.docs.map(
            (docSnap: QueryDocumentSnapshot<DocumentData>) => docSnap.data() as Student
          );
          setRawStudents(loadedStudents);
          setLocalItem("kizilelma_students", loadedStudents);
        }
        studentsLoaded = true;
        checkFullyLoaded();
      },
      (err: unknown) => {
        console.error("Students listener error:", err);
        studentsLoaded = true;
        checkFullyLoaded();
      }
    );

    // 3. Programs listener
    const unsubPrograms = onSnapshot(
      collection(database, "programs"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!snapshot.empty) {
          const loadedPrograms = snapshot.docs.map(
            (docSnap: QueryDocumentSnapshot<DocumentData>) => docSnap.data() as Program
          );
          setPrograms(loadedPrograms);
          setLocalItem("kizilelma_programs", loadedPrograms);
        }
        programsLoaded = true;
        checkFullyLoaded();
      },
      (err: unknown) => {
        console.error("Programs listener error:", err);
        programsLoaded = true;
        checkFullyLoaded();
      }
    );

    // 4. Results listener
    const unsubResults = onSnapshot(
      collection(database, "results"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const loadedResults = snapshot.docs.map(
          (docSnap: QueryDocumentSnapshot<DocumentData>) => docSnap.data() as Result
        );
        setResults(loadedResults);
        setLocalItem("kizilelma_results", loadedResults);
        resultsLoaded = true;
        checkFullyLoaded();
      },
      (err: unknown) => {
        console.error("Results listener error:", err);
        resultsLoaded = true;
        checkFullyLoaded();
      }
    );

    // 5. Slideshow Images listener
    const unsubSlideshow = onSnapshot(
      collection(database, "slideshow_images"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const loaded = snapshot.docs.map(
          (docSnap: QueryDocumentSnapshot<DocumentData>) => docSnap.data() as SlideshowImage
        );
        if (loaded.length > 0) {
          setSlideshowImages(loaded);
          setLocalItem("kizilelma_slideshow_images", loaded);
        }
      },
      (err: unknown) => {
        console.error("Slideshow listener error:", err);
      }
    );

    return () => {
      unsubTeams();
      unsubStudents();
      unsubPrograms();
      unsubResults();
      unsubSlideshow();
    };
  }, []);

  // ─── Slideshow Images CRUD Operations ────────────────────
  const addSlideshowImage = async (img: Omit<SlideshowImage, "id">) => {
    const id = "slide-" + Date.now();
    const newSlide: SlideshowImage = {
      ...img,
      id,
      created_at: new Date().toISOString(),
    };
    setSlideshowImages((prev) => {
      const updated = [newSlide, ...prev];
      try {
        localStorage.setItem("kizilelma_slideshow_images", JSON.stringify(updated));
      } catch (e) {
        console.warn("LocalStorage save error:", e);
      }
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "slideshow_images", id), newSlide);
        console.log("✅ Slideshow image saved to Firebase successfully!");
      } catch (err) {
        console.error("❌ Failed to save slideshow image to Firebase:", err);
      }
    }
  };

  const updateSlideshowImage = async (id: string, updates: Partial<SlideshowImage>) => {
    setSlideshowImages((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      try {
        localStorage.setItem("kizilelma_slideshow_images", JSON.stringify(updated));
      } catch (e) {
        console.warn("LocalStorage update error:", e);
      }
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, "slideshow_images", id), updates);
        console.log("✅ Slideshow image updated in Firebase!");
      } catch (err) {
        console.error("❌ Failed to update slideshow image in Firebase:", err);
      }
    }
  };

  const deleteSlideshowImage = async (id: string) => {
    setSlideshowImages((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("kizilelma_slideshow_images", JSON.stringify(updated));
      } catch (e) {
        console.warn("LocalStorage delete error:", e);
      }
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "slideshow_images", id));
        console.log("✅ Slideshow image deleted from Firebase!");
      } catch (err) {
        console.error("❌ Failed to delete slideshow image from Firebase:", err);
      }
    }
  };

  /** Seed Firebase with initial mock data if database is empty */
  async function seedFirebase() {
    if (!db) return;
    const database = db;
    try {
      const batch = writeBatch(database);
      INITIAL_TEAMS.forEach((t) => batch.set(doc(database, "teams", t.id), t));
      INITIAL_STUDENTS.forEach((s) => batch.set(doc(database, "students", s.id), s));
      INITIAL_PROGRAMS.forEach((p) => batch.set(doc(database, "programs", p.id), p));
      INITIAL_RESULTS.forEach((r) => batch.set(doc(database, "results", r.id), r));
      await batch.commit();
      console.log("✅ Seeded Firebase Firestore successfully!");
    } catch (err) {
      console.error("Failed to seed Firebase:", err);
    }
  }

  // Calculate scores dynamically from results with useMemo for stable object references
  const { teams, students } = useMemo(() => {
    const studentPointsMap: Record<string, number> = {};
    const teamPointsMap: Record<string, number> = {};

    rawStudents.forEach((s) => (studentPointsMap[s.id] = 0));
    rawTeams.forEach((t) => (teamPointsMap[t.id] = 0));

    results.forEach((r) => {
      // Exclude results for programs that are hidden (is_revealed === false)
      const prog = programs.find((p) => p.id === r.program_id);
      if (prog && !prog.is_revealed) return;

      // Check if result is awarded directly to a Team/Group (e.g. General Programmes)
      const directTeam = rawTeams.find((t) => t.id === r.student_id || (r.team_id && t.id === r.team_id));
      if (directTeam) {
        teamPointsMap[directTeam.id] = (teamPointsMap[directTeam.id] || 0) + r.points_awarded;
      } else {
        // Individual student result
        const student = rawStudents.find((s) => s.id === r.student_id);
        if (student) {
          studentPointsMap[student.id] = (studentPointsMap[student.id] || 0) + r.points_awarded;
          if (student.team_id) {
            teamPointsMap[student.team_id] = (teamPointsMap[student.team_id] || 0) + r.points_awarded;
          }
        }
      }
    });

    const computedTeams: Team[] = rawTeams.map((t) => {
      let name = t.name;
      let color = t.color || "#3B82F6";
      let logo_url = t.logo_url || "";

      if (t.id === "team-a" || t.name.toLowerCase().includes("group a") || t.name.toLowerCase().includes("quba")) {
        name = t.name || "QUBA";
        color = t.color || "#FFFFFF";
      } else if (t.id === "team-b" || t.name.toLowerCase().includes("group b") || t.name.toLowerCase().includes("juhfa")) {
        name = t.name || "JUHFA";
        color = t.color || "#38BDF8";
      } else if (t.id === "team-c" || t.name.toLowerCase().includes("group c") || t.name.toLowerCase().includes("khudyd")) {
        name = t.name || "KHUDYD";
        color = t.color || "#EF4444";
      } else if (t.id === "team-d" || t.name.toLowerCase().includes("group d") || t.name.toLowerCase().includes("thawr")) {
        name = t.name || "THAWR";
        color = t.color || "#10B981";
      }

      return {
        ...t,
        name,
        color,
        logo_url,
        total_score: teamPointsMap[t.id] || 0,
      };
    });

    const computedStudents: Student[] = rawStudents.map((s) => ({
      ...s,
      total_points: studentPointsMap[s.id] || 0,
    }));

    return { teams: computedTeams, students: computedStudents };
  }, [rawTeams, rawStudents, results, programs]);

  // ─── Direct Firebase Mutations ────────────────────────────────────

  const toggleProgramReveal = async (programId: string) => {
    const target = programs.find((p) => p.id === programId);
    if (!target) return;

    const newRevealed = !target.is_revealed;

    setPrograms((prev) => {
      const updated = prev.map((p) =>
        p.id === programId ? { ...p, is_revealed: newRevealed } : p
      );
      setLocalItem("kizilelma_programs", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, "programs", programId), {
          is_revealed: newRevealed,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to toggle program reveal in Firebase:", err);
      }
    }
  };

  const saveProgramResults = async (
    programId: string,
    winnerInputs: Array<{
      studentId: string;
      position?: 1 | 2 | 3 | null;
      grade?: string | null;
      points?: number | "";
    }>
  ) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return;

    const now = new Date().toISOString();

    const newProgResults: Result[] = winnerInputs
      .filter((row) => Boolean(row.studentId))
      .map((row, idx) => {
        let pts = typeof row.points === "number" && !isNaN(row.points) ? Number(row.points) : 0;

        if (row.points === "" || row.points === undefined || row.points === null) {
          if (row.position === 1) pts = prog.points_1st;
          else if (row.position === 2) pts = prog.points_2nd;
          else if (row.position === 3) pts = prog.points_3rd;
          else if (row.grade === "A") pts = prog.points_A || 5;
          else if (row.grade === "B") pts = prog.points_B || 3;
          else if (row.grade === "C") pts = prog.points_C || 2;
          else if (row.grade === "D") pts = prog.points_D || 1;
          else pts = 0;
        }

        const resId = `res-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
        return {
          id: resId,
          program_id: programId,
          student_id: row.studentId,
          position: row.position || null,
          grade: row.grade || null,
          points_awarded: pts,
          created_at: now,
        };
      });

    setResults((prev) => {
      const filtered = prev.filter((r) => r.program_id !== programId);
      const updated = [...filtered, ...newProgResults];
      setLocalItem("kizilelma_results", updated);
      return updated;
    });

    setPrograms((prev) => {
      const updated = prev.map((p) =>
        p.id === programId ? { ...p, is_revealed: true, updated_at: now } : p
      );
      setLocalItem("kizilelma_programs", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      const database = db;
      try {
        const resultsSnapshot = await getDocs(collection(database, "results"));
        const batch = writeBatch(database);

        resultsSnapshot.docs.forEach((docSnap) => {
          if (docSnap.data().program_id === programId) {
            batch.delete(docSnap.ref);
          }
        });

        newProgResults.forEach((newRes) => {
          batch.set(doc(database, "results", newRes.id), newRes);
        });

        batch.update(doc(database, "programs", programId), {
          is_revealed: true,
          updated_at: now,
        });

        await batch.commit();
        console.log("✅ Program results saved to Firebase successfully!");
      } catch (err) {
        console.error("Failed to save program results to Firebase:", err);
      }
    }
  };

  const addOrUpdateResult = async (
    programId: string,
    studentId: string,
    position?: 1 | 2 | 3 | null,
    grade?: string | null,
    customPoints?: number
  ) => {
    const existingProgResults = results
      .filter((r) => r.program_id === programId && r.student_id !== studentId)
      .map((r) => ({
        studentId: r.student_id,
        position: r.position,
        grade: r.grade,
        points: r.points_awarded,
      }));

    await saveProgramResults(programId, [
      ...existingProgResults,
      {
        studentId,
        position,
        grade,
        points: customPoints,
      },
    ]);
  };

  const addQuickScore = async (studentId: string, points: number, remarks?: string) => {
    const defaultProg = programs[0] || { id: "quick-award-prog" };
    const resId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRes: Result = {
      id: resId,
      program_id: defaultProg.id,
      student_id: studentId,
      points_awarded: points,
      remarks: remarks || `Quick Score Award (+${points})`,
      created_at: new Date().toISOString(),
    };

    setResults((prev) => {
      const updated = [...prev, newRes];
      setLocalItem("kizilelma_results", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "results", resId), newRes);
        console.log("✅ Quick score added to Firebase!");
      } catch (err) {
        console.error("Failed to add quick score to Firebase:", err);
      }
    }
  };

  const deleteResult = async (resultId: string) => {
    setResults((prev) => {
      const updated = prev.filter((r) => r.id !== resultId);
      setLocalItem("kizilelma_results", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "results", resultId));
        console.log("✅ Result deleted from Firebase!");
      } catch (err) {
        console.error("Failed to delete result from Firebase:", err);
      }
    }
  };

  const addTeam = async (name: string, color: string, logo_url?: string) => {
    const teamId = `team-${Date.now()}`;
    const newTeam: Team = {
      id: teamId,
      name,
      color,
      logo_url: logo_url || "",
      total_score: 0,
    };

    setRawTeams((prev) => {
      const updated = [...prev, newTeam];
      setLocalItem("kizilelma_teams", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "teams", teamId), newTeam);
        console.log("✅ Team added to Firebase!");
      } catch (err) {
        console.error("Failed to add team to Firebase:", err);
      }
    }
  };

  const addStudent = async (
    name: string,
    team_id: string,
    grade: string = "A",
    chest_no?: number,
    photo_url?: string
  ) => {
    const studentId = `stud-${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      name,
      chest_no,
      team_id,
      grade,
      photo_url: photo_url || UNKNOWN_PERSON_AVATAR,
      total_points: 0,
    };

    setRawStudents((prev) => {
      const updated = [...prev, newStudent];
      setLocalItem("kizilelma_students", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "students", studentId), newStudent);
        console.log("✅ Student added to Firebase!");
      } catch (err) {
        console.error("Failed to add student to Firebase:", err);
      }
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    setRawStudents((prev) => {
      const updated = prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s));
      setLocalItem("kizilelma_students", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "students", studentId), updates, { merge: true });
        console.log("✅ Student updated in Firebase!");
      } catch (err) {
        console.error("Failed to update student in Firebase:", err);
      }
    }
  };

  const deleteStudent = async (studentId: string) => {
    setRawStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      setLocalItem("kizilelma_students", updated);
      return updated;
    });

    setResults((prev) => {
      const updated = prev.filter((r) => r.student_id !== studentId);
      setLocalItem("kizilelma_results", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      const database = db;
      try {
        const batch = writeBatch(database);
        batch.delete(doc(database, "students", studentId));

        const resultsSnapshot = await getDocs(collection(database, "results"));
        resultsSnapshot.docs.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          if (docSnap.data().student_id === studentId) {
            batch.delete(docSnap.ref);
          }
        });

        await batch.commit();
        console.log("✅ Student deleted from Firebase!");
      } catch (err) {
        console.error("Failed to delete student from Firebase:", err);
      }
    }
  };

  const addProgram = async (
    name: string,
    category: string,
    grade: string = "A",
    points_1st: number = 5,
    points_2nd: number = 3,
    points_3rd: number = 1
  ) => {
    const progId = `prog-${Date.now()}`;
    const newProg: Program = {
      id: progId,
      name,
      category,
      grade,
      is_revealed: true,
      points_1st,
      points_2nd,
      points_3rd,
      points_A: 5,
      points_B: 3,
      points_C: 2,
      points_D: 1,
    };

    setPrograms((prev) => {
      const updated = [...prev, newProg];
      setLocalItem("kizilelma_programs", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "programs", progId), newProg);
        console.log("✅ Program added to Firebase!");
      } catch (err) {
        console.error("Failed to add program to Firebase:", err);
      }
    }
  };

  const updateProgram = async (programId: string, updates: Partial<Program>) => {
    setPrograms((prev) => {
      const updated = prev.map((p) => (p.id === programId ? { ...p, ...updates } : p));
      setLocalItem("kizilelma_programs", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "programs", programId), updates, { merge: true });
        console.log("✅ Program updated in Firebase!");
      } catch (err) {
        console.error("Failed to update program in Firebase:", err);
      }
    }
  };

  const deleteProgram = async (programId: string) => {
    setPrograms((prev) => {
      const updated = prev.filter((p) => p.id !== programId);
      setLocalItem("kizilelma_programs", updated);
      return updated;
    });

    setResults((prev) => {
      const updated = prev.filter((r) => r.program_id !== programId);
      setLocalItem("kizilelma_results", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      const database = db;
      try {
        const batch = writeBatch(database);
        batch.delete(doc(database, "programs", programId));

        const resultsSnapshot = await getDocs(collection(database, "results"));
        resultsSnapshot.docs.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          if (docSnap.data().program_id === programId) {
            batch.delete(docSnap.ref);
          }
        });

        await batch.commit();
        console.log("✅ Program and its results deleted from Firebase!");
      } catch (err) {
        console.error("Failed to delete program from Firebase:", err);
      }
    }
  };

  const updateTeam = async (teamId: string, updates: Partial<Team>) => {
    setRawTeams((prev) => {
      const updated = prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t));
      setLocalItem("kizilelma_teams", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "teams", teamId), updates, { merge: true });
        console.log("✅ Team updated in Firebase!");
      } catch (err) {
        console.error("Failed to update team in Firebase:", err);
      }
    }
  };

  const resetAllPointsToZero = async () => {
    setResults([]);
    setLocalItem("kizilelma_results", []);

    setPrograms((prev) => {
      const updated = prev.map((p) => ({ ...p, is_revealed: false }));
      setLocalItem("kizilelma_programs", updated);
      return updated;
    });

    if (db && isFirebaseConfigured) {
      const database = db;
      try {
        const batch = writeBatch(database);

        const resultsSnapshot = await getDocs(collection(database, "results"));
        resultsSnapshot.docs.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          batch.delete(docSnap.ref);
        });

        const programsSnapshot = await getDocs(collection(database, "programs"));
        programsSnapshot.docs.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          batch.update(docSnap.ref, { is_revealed: false });
        });

        await batch.commit();
        console.log("✅ All points reset to zero in Firebase!");
      } catch (err) {
        console.error("Failed to reset points in Firebase:", err);
      }
    }
  };

  const resetToDemoData = async () => {
    setRawTeams(INITIAL_TEAMS);
    setRawStudents(INITIAL_STUDENTS);
    setPrograms(INITIAL_PROGRAMS);
    setResults(INITIAL_RESULTS);

    setLocalItem("kizilelma_teams", INITIAL_TEAMS);
    setLocalItem("kizilelma_students", INITIAL_STUDENTS);
    setLocalItem("kizilelma_programs", INITIAL_PROGRAMS);
    setLocalItem("kizilelma_results", INITIAL_RESULTS);

    if (db && isFirebaseConfigured) {
      const database = db;
      try {
        const collections = ["results", "students", "programs", "teams"];
        for (const colName of collections) {
          const snapshot = await getDocs(collection(database, colName));
          const batch = writeBatch(database);
          snapshot.docs.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) =>
            batch.delete(docSnap.ref)
          );
          await batch.commit();
        }

        await seedFirebase();
        console.log("✅ Reset to demo data in Firebase!");
      } catch (err) {
        console.error("Failed to reset to demo data in Firebase:", err);
      }
    };
  };

  const getScoreProgressionData = (): ScoreProgressionPoint[] => {
    const activePrograms = programs.filter((p) => p.is_revealed);
    if (activePrograms.length === 0) return [];

    const runningScores: Record<string, number> = {};
    teams.forEach((t) => (runningScores[t.name] = 0));

    const progressionPoints: ScoreProgressionPoint[] = [];

    activePrograms.forEach((prog) => {
      const progResults = results.filter((r) => r.program_id === prog.id);
      progResults.forEach((r) => {
        const student = students.find((s) => s.id === r.student_id);
        if (student) {
          const team = teams.find((t) => t.id === student.team_id);
          if (team) {
            runningScores[team.name] = (runningScores[team.name] || 0) + r.points_awarded;
          }
        }
      });

      const point: ScoreProgressionPoint = {
        program: prog.name,
      };
      teams.forEach((t) => {
        point[t.name] = runningScores[t.name] || 0;
      });

      progressionPoints.push(point);
    });

    return progressionPoints;
  };

  return {
    teams,
    students,
    programs,
    results,
    slideshowImages,
    isLoading,
    isConfigured: isFirebaseConfigured,
    toggleProgramReveal,
    addOrUpdateResult,
    saveProgramResults,
    addQuickScore,
    deleteResult,
    addTeam,
    addStudent,
    updateStudent,
    deleteStudent,
    addProgram,
    updateProgram,
    deleteProgram,
    updateTeam,
    addSlideshowImage,
    updateSlideshowImage,
    deleteSlideshowImage,
    resetAllPointsToZero,
    resetToDemoData,
    getScoreProgressionData,
    reload: () => {},
  };
}
