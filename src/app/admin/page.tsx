"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useFestStore } from "@/lib/store";
import { SUPABASE_SQL_SCHEMA, AVATAR_PRESETS, UNKNOWN_PERSON_AVATAR } from "@/lib/mockData";
import { Student, Program, Team } from "@/types";
import { TeamLogoAvatar } from "@/components/TeamLogoAvatar";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Trophy,
  Users,
  Award,
  Layers,
  Copy,
  Check,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Zap,
  Edit,
  UserCheck,
  Flame,
  UserX,
  Search,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";
import { InstagramIcon } from "@/components/ImageSlideshow";
import { compressImageFile } from "@/lib/imageCompressor";
import Link from "next/link";

export interface WinnerRow {
  id: string;
  studentId: string;
  position: 1 | 2 | 3 | null;
  grade: string;
  points: number | "";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<
    "results" | "quickscore" | "programs" | "teams" | "students" | "slideshow" | "settings"
  >("results");
  const [copiedSql, setCopiedSql] = useState(false);

  const {
    teams,
    students,
    programs,
    results,
    slideshowImages,
    addOrUpdateResult,
    saveProgramResults,
    addQuickScore,
    toggleProgramReveal,
    addTeam,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteResult,
    addProgram,
    updateProgram,
    deleteProgram,
    updateTeam,
    addSlideshowImage,
    updateSlideshowImage,
    deleteSlideshowImage,
    resetAllPointsToZero,
    resetToDemoData,
    isConfigured,
  } = useFestStore();

  // Slideshow Manager State
  const [slideImageUrl, setSlideImageUrl] = useState("");
  const [slideExtraUrls, setSlideExtraUrls] = useState<string[]>([]);
  const [slideExtraInput, setSlideExtraInput] = useState("");
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideCategory, setSlideCategory] = useState("Stage");
  const [slideAspect, setSlideAspect] = useState("portrait");
  const [slideInstagramUrl, setSlideInstagramUrl] = useState("");
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [deletingSlideId, setDeletingSlideId] = useState<string | null>(null);
  const [slideFileName, setSlideFileName] = useState("");
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const multipleSlideFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Result state
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editResultPosition, setEditResultPosition] = useState<1 | 2 | 3 | null>(null);
  const [editResultGrade, setEditResultGrade] = useState("");
  const [editResultPoints, setEditResultPoints] = useState<number>(0);
  const [editResultStudentId, setEditResultStudentId] = useState("");
  const [allResultsSearch, setAllResultsSearch] = useState("");
  const [allResultsGroupFilter, setAllResultsGroupFilter] = useState("All");

  // Search inputs everywhere in admin page
  const [programSearch, setProgramSearch] = useState("");
  const [quickStudentSearch, setQuickStudentSearch] = useState("");
  const [rosterStudentSearch, setRosterStudentSearch] = useState("");
  const [programTabSearch, setProgramTabSearch] = useState("");
  const [adminProgBracketFilter, setAdminProgBracketFilter] = useState("All");
  const [winnerStudentSearch, setWinnerStudentSearch] = useState("");
  const [winnerGroupFilter, setWinnerGroupFilter] = useState("All");

  // Per-row student search state for autocomplete in winner rows
  const [rowStudentSearches, setRowStudentSearches] = useState<Record<string, string>>({});
  const [openRowSearch, setOpenRowSearch] = useState<string | null>(null);

  // Results Entry Form state (Dynamic Winner Rows for multiple 1st, 2nd, 3rd, or grade winners)
  const [selectedProgId, setSelectedProgId] = useState("");
  const [winnerRows, setWinnerRows] = useState<WinnerRow[]>([
    { id: "row-1", studentId: "", position: 1, grade: "", points: 15 },
    { id: "row-2", studentId: "", position: 2, grade: "", points: 10 },
    { id: "row-3", studentId: "", position: 3, grade: "", points: 5 },
  ]);

  // Quick Score state
  const [quickScoreStudId, setQuickScoreStudId] = useState("");
  const [customQuickPoints, setCustomQuickPoints] = useState<number | "">("");

  // New Team Form state
  const [teamName, setTeamName] = useState("");
  const [teamColor, setTeamColor] = useState("#EF4444");
  const [teamLogo, setTeamLogo] = useState("");

  // New Student Form state
  const [studName, setStudName] = useState("");
  const [studChestNo, setStudChestNo] = useState<number | "">("");
  const [studTeamId, setStudTeamId] = useState("");
  const [studGrade, setStudGrade] = useState("A");
  const [studPhoto, setStudPhoto] = useState(UNKNOWN_PERSON_AVATAR);
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(AVATAR_PRESETS[0].url);
  const [studUploadedFileName, setStudUploadedFileName] = useState("");

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editStudName, setEditStudName] = useState("");
  const [editStudChestNo, setEditStudChestNo] = useState<number | "">("");
  const [editStudTeamId, setEditStudTeamId] = useState("");
  const [editStudGrade, setEditStudGrade] = useState("A");
  const [editStudPhoto, setEditStudPhoto] = useState("");
  const [editUploadedFileName, setEditUploadedFileName] = useState("");

  // Program Edit Modal state
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editProgName, setEditProgName] = useState("");
  const [editProgCat, setEditProgCat] = useState("Stage");
  const [editProgGrade, setEditProgGrade] = useState("A");
  const [editPts1st, setEditPts1st] = useState(15);
  const [editPts2nd, setEditPts2nd] = useState(10);
  const [editPts3rd, setEditPts3rd] = useState(5);

  // Program Delete Confirmation state
  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null);

  // Student Delete Confirmation state
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Team Edit Modal state
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamColor, setEditTeamColor] = useState("#EF4444");
  const [editTeamLogo, setEditTeamLogo] = useState("");

  // File upload refs
  const registerFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const isPopStateRef = useRef(false);
  const initialStudIdRef = useRef<string | null>(null);
  const studentsRef = useRef(students);

  useEffect(() => {
    studentsRef.current = students;
  }, [students]);

  const pushAdminState = useCallback((tab: string, editStudId: string | null) => {
    if (isPopStateRef.current || typeof window === "undefined") return;

    const stateObj = { adminTab: tab, editingStudentId: editStudId };

    if (
      window.history.state?.adminTab === tab &&
      window.history.state?.editingStudentId === editStudId
    ) {
      return;
    }

    window.history.pushState(stateObj, "", window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) return;

    const hash = window.location.hash;
    let initialTab = "results";
    let initialStudId: string | null = null;

    if (hash.startsWith("#edit-student-")) {
      initialStudId = hash.replace("#edit-student-", "");
      initialTab = "students";
    } else if (hash.startsWith("#admin-")) {
      const t = hash.replace("#admin-", "");
      if (["results", "quickscore", "programs", "teams", "students", "settings"].includes(t)) {
        initialTab = t;
      }
    }

    initialStudIdRef.current = initialStudId;

    const initialState = { adminTab: initialTab, editingStudentId: initialStudId };
    if (!window.history.state) {
      window.history.replaceState(
        initialState,
        "",
        window.location.pathname + window.location.search
      );
    }
    setActiveAdminTab(initialTab as any);
  }, [isAuthenticated]);

  useEffect(() => {
    if (initialStudIdRef.current && students.length > 0) {
      const s = students.find((st) => st.id === initialStudIdRef.current);
      if (s) {
        setEditingStudent(s);
        setEditStudName(s.name);
        setEditStudChestNo(s.chest_no ?? "");
        setEditStudTeamId(s.team_id);
        setEditStudGrade(s.grade || "A");
        setEditStudPhoto(s.photo_url || UNKNOWN_PERSON_AVATAR);
        initialStudIdRef.current = null;
      }
    }
  }, [students]);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) return;

    const handlePopState = (event: PopStateEvent) => {
      isPopStateRef.current = true;
      const state = event.state;
      const currentStudents = studentsRef.current;

      if (state && state.adminTab) {
        setActiveAdminTab(state.adminTab);
        if (state.editingStudentId) {
          const s = currentStudents.find((st) => st.id === state.editingStudentId);
          if (s) {
            setEditingStudent(s);
            setEditStudName(s.name);
            setEditStudChestNo(s.chest_no ?? "");
            setEditStudTeamId(s.team_id);
            setEditStudGrade(s.grade || "A");
            setEditStudPhoto(s.photo_url || UNKNOWN_PERSON_AVATAR);
          } else {
            setEditingStudent(null);
          }
        } else {
          setEditingStudent(null);
        }
      } else {
        setEditingStudent(null);
      }

      setTimeout(() => {
        isPopStateRef.current = false;
      }, 50);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAuthenticated]);

  const changeAdminTab = (tab: "results" | "quickscore" | "programs" | "teams" | "students" | "slideshow" | "settings") => {
    setActiveAdminTab(tab);
    setEditingStudent(null);
    pushAdminState(tab, null);
  };

  // Slideshow Handlers
  const handleOpenAddSlide = () => {
    setEditingSlideId(null);
    setSlideImageUrl("");
    setSlideExtraUrls([]);
    setSlideExtraInput("");
    setSlideTitle("");
    setSlideSubtitle("");
    setSlideCategory("Stage");
    setSlideAspect("portrait");
    setSlideInstagramUrl("");
    setSlideFileName("");
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: {
    id: string;
    image_url: string;
    images?: string[];
    title?: string;
    subtitle?: string;
    category?: string;
    aspect_ratio?: string;
    instagram_url?: string;
  }) => {
    setEditingSlideId(slide.id);
    setSlideImageUrl(slide.image_url);
    setSlideExtraUrls(slide.images ? slide.images.filter((u) => u !== slide.image_url) : []);
    setSlideExtraInput("");
    setSlideTitle(slide.title || "");
    setSlideSubtitle(slide.subtitle || "");
    setSlideCategory(slide.category || "Stage");
    setSlideAspect(slide.aspect_ratio || "portrait");
    setSlideInstagramUrl(slide.instagram_url || "");
    setSlideFileName("");
    setIsSlideModalOpen(true);
  };

  const handleAddExtraSlideUrl = () => {
    if (!slideExtraInput.trim()) return;
    setSlideExtraUrls((prev) => [...prev, slideExtraInput.trim()]);
    setSlideExtraInput("");
  };

  const handleRemoveExtraSlideUrl = (index: number) => {
    setSlideExtraUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      // Validate file size (max 40MB raw input)
      if (file.size > 40 * 1024 * 1024) {
        setResultSuccessMsg(`❌ "${file.name}" is too large! Max 40MB per image allowed.`);
        setTimeout(() => setResultSuccessMsg(""), 4000);
        continue;
      }

      try {
        const compressedResult = await compressImageFile(file, 1200, 1200, 0.75);
        setSlideImageUrl((prev) => {
          if (!prev.trim()) {
            setSlideFileName(file.name);
            return compressedResult;
          }
          return prev;
        });
        setSlideExtraUrls((prev) => Array.from(new Set([...prev, compressedResult])));
      } catch (err) {
        console.error("Failed to compress image file:", err);
      }
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImageUrl.trim()) {
      setResultSuccessMsg("❌ Please select or paste a primary image URL!");
      setTimeout(() => setResultSuccessMsg(""), 3000);
      return;
    }

    const allImages = Array.from(new Set([slideImageUrl.trim(), ...slideExtraUrls.filter((u) => u.trim())]));

    if (editingSlideId) {
      await updateSlideshowImage(editingSlideId, {
        image_url: slideImageUrl.trim(),
        images: allImages,
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        category: slideCategory,
        aspect_ratio: slideAspect,
        instagram_url: slideInstagramUrl.trim(),
      });
      setResultSuccessMsg("Mosaic gallery card updated successfully! 📸");
    } else {
      await addSlideshowImage({
        image_url: slideImageUrl.trim(),
        images: allImages,
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        category: slideCategory,
        aspect_ratio: slideAspect,
        instagram_url: slideInstagramUrl.trim(),
      });
      setResultSuccessMsg("New Mosaic gallery card added successfully! 📸");
    }

    setIsSlideModalOpen(false);
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleConfirmDeleteSlide = async () => {
    if (!deletingSlideId) return;
    await deleteSlideshowImage(deletingSlideId);
    setDeletingSlideId(null);
    setResultSuccessMsg("Gallery card removed successfully! 🗑️");
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  // Handle file upload -> base64 conversion with auto-compression
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setPhoto: (url: string) => void,
    setFileName: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setResultSuccessMsg("❌ Please select an image file (JPG, PNG, GIF, WebP)");
      setTimeout(() => setResultSuccessMsg(""), 4000);
      return;
    }

    // Validate file size (max 40MB)
    if (file.size > 40 * 1024 * 1024) {
      setResultSuccessMsg("❌ Image too large! Max 40MB allowed.");
      setTimeout(() => setResultSuccessMsg(""), 4000);
      return;
    }

    try {
      const compressedBase64 = await compressImageFile(file, 400, 400, 0.72);
      setPhoto(compressedBase64);
      setFileName(file.name);
    } catch (err) {
      console.error("Image compression error:", err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhoto(base64);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelUpload = (
    setPhoto: (url: string) => void,
    setFileName: (name: string) => void,
    fallback: string,
    fileInputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    setPhoto(fallback);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // New Program Form state
  const [progName, setProgName] = useState("");
  const [progCat, setProgCat] = useState("Stage");
  const [progGrade, setProgGrade] = useState("A");
  const [pts1st, setPts1st] = useState(5);
  const [pts2nd, setPts2nd] = useState(3);
  const [pts3rd, setPts3rd] = useState(1);

  // Student Filter State
  const [studentGradeFilter, setStudentGradeFilter] = useState("All");

  const [resultSuccessMsg, setResultSuccessMsg] = useState("");

  const handleProgSelect = (progId: string) => {
    setSelectedProgId(progId);
    const prog = programs.find((p) => p.id === progId);
    if (!prog) return;

    const existingResults = results
      .filter((r) => r.program_id === progId)
      .sort((a, b) => (a.position || 99) - (b.position || 99));

    if (existingResults.length > 0) {
      setWinnerRows(
        existingResults.map((r, i) => ({
          id: `row-exist-${i}-${Date.now()}`,
          studentId: r.student_id,
          position: r.position || null,
          grade: r.grade || "",
          points: r.points_awarded,
        }))
      );
    } else {
      setWinnerRows([
        { id: `row-1-${Date.now()}`, studentId: "", position: 1, grade: "", points: prog.points_1st || 15 },
        { id: `row-2-${Date.now()}`, studentId: "", position: 2, grade: "", points: prog.points_2nd || 10 },
        { id: `row-3-${Date.now()}`, studentId: "", position: 3, grade: "", points: prog.points_3rd || 5 },
      ]);
    }
  };

  const addWinnerRow = (defaultPos: 1 | 2 | 3 | null = 1) => {
    const prog = programs.find((p) => p.id === selectedProgId);
    let pts: number = 15;
    if (defaultPos === 2) pts = prog?.points_2nd || 10;
    else if (defaultPos === 3) pts = prog?.points_3rd || 5;
    else if (defaultPos === null) pts = 5;
    else pts = prog?.points_1st || 15;

    setWinnerRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentId: "",
        position: defaultPos,
        grade: "",
        points: pts,
      },
    ]);
  };

  const updateWinnerRow = (id: string, field: keyof WinnerRow, value: any) => {
    setWinnerRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const removeWinnerRow = (id: string) => {
    setWinnerRows((prev) => prev.filter((r) => r.id !== id));
  };

  const ADMIN_PASS =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2031";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgId) return;

    await saveProgramResults(selectedProgId, winnerRows);

    setResultSuccessMsg("Results published! Program auto-revealed, moved to top of Results, and scores updated live! 🚀");
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleQuickAddPoints = async (points: number) => {
    if (!quickScoreStudId) return;
    await addQuickScore(quickScoreStudId, points);
    const stud = students.find((s) => s.id === quickScoreStudId);
    setResultSuccessMsg(`Successfully awarded +${points} points to ${stud?.name || "Student"}!`);
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    await addTeam(teamName, teamColor, teamLogo);
    setTeamName("");
    setTeamLogo("");
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName || !studTeamId) return;
    const finalPhoto = studPhoto || selectedPresetAvatar || UNKNOWN_PERSON_AVATAR;
    await addStudent(
      studName,
      studTeamId,
      studGrade,
      typeof studChestNo === "number" ? studChestNo : undefined,
      finalPhoto
    );
    setStudName("");
    setStudChestNo("");
    setStudPhoto(UNKNOWN_PERSON_AVATAR);
  };

  const handleOpenEditStudent = (s: Student) => {
    setEditingStudent(s);
    setEditStudName(s.name);
    setEditStudChestNo(s.chest_no ?? "");
    setEditStudTeamId(s.team_id);
    setEditStudGrade(s.grade || "A");
    setEditStudPhoto(s.photo_url || UNKNOWN_PERSON_AVATAR);
    pushAdminState(activeAdminTab, s.id);
  };

  const handleCloseEditStudent = () => {
    setEditingStudent(null);
    if (typeof window !== "undefined" && window.history.state?.editingStudentId) {
      window.history.back();
    } else {
      pushAdminState(activeAdminTab, null);
    }
  };

  const handleSaveEditedStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    await updateStudent(editingStudent.id, {
      name: editStudName,
      chest_no: typeof editStudChestNo === "number" ? editStudChestNo : undefined,
      team_id: editStudTeamId,
      grade: editStudGrade,
      photo_url: editStudPhoto,
    });
    handleCloseEditStudent();
    setResultSuccessMsg("Student profile updated successfully!");
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName) return;
    await addProgram(progName, progCat, progGrade, pts1st, pts2nd, pts3rd);
    setProgName("");
  };

  const handleOpenEditProgram = (p: Program) => {
    setEditingProgram(p);
    setEditProgName(p.name);
    setEditProgCat(p.category);
    setEditProgGrade(p.grade || "A");
    setEditPts1st(p.points_1st);
    setEditPts2nd(p.points_2nd);
    setEditPts3rd(p.points_3rd);
  };

  const handleSaveEditedProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    await updateProgram(editingProgram.id, {
      name: editProgName,
      category: editProgCat,
      grade: editProgGrade,
      points_1st: editPts1st,
      points_2nd: editPts2nd,
      points_3rd: editPts3rd,
    });
    setEditingProgram(null);
    setResultSuccessMsg("Program updated successfully! ✅");
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleConfirmDeleteProgram = async () => {
    if (!deletingProgramId) return;
    const prog = programs.find((p) => p.id === deletingProgramId);
    await deleteProgram(deletingProgramId);
    setDeletingProgramId(null);
    setResultSuccessMsg(`Program "${prog?.name || "Unknown"}" deleted successfully! 🗑️`);
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleConfirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    const name = deletingStudent.name;
    await deleteStudent(deletingStudent.id);
    setDeletingStudent(null);
    setResultSuccessMsg(`Student "${name}" and all their results deleted successfully! 🗑️`);
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const handleOpenEditTeam = (t: Team) => {
    setEditingTeam(t);
    setEditTeamName(t.name);
    setEditTeamColor(t.color);
    setEditTeamLogo(t.logo_url || "");
  };

  const handleSaveEditedTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    await updateTeam(editingTeam.id, {
      name: editTeamName,
      color: editTeamColor,
      logo_url: editTeamLogo ? editTeamLogo.trim() : "",
    });
    setEditingTeam(null);
    setResultSuccessMsg("Team profile updated successfully! ✅");
    setTimeout(() => setResultSuccessMsg(""), 4000);
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Password Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 bg-[#f6f8fc]">
        <div className="w-full max-w-md my-auto space-y-6">
          {/* Main Login Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100/80 text-slate-800 space-y-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-full mx-auto p-1.5 flex items-center justify-center bg-white shadow-md border border-slate-100">
              <img
                src="/logo.png"
                alt="Kizil Elma 2k26"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#0066cc] tracking-tight">
                Kizil Elma 2k26
              </h1>
              <p className="text-lg font-bold text-slate-700 mt-1">
                Admin Portal
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6 pt-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-xs font-semibold text-[#0066cc] hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus-within:border-[#0066cc] focus-within:ring-2 focus-within:ring-[#0066cc]/20 transition-all shadow-sm">
                  <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none"
                  />
                </div>
                {authError && (
                  <p className="text-xs text-red-500 font-semibold mt-2">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#0066cc] hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 hover:text-[#0066cc] inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Public Scoreboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-4 space-y-2 text-slate-400 text-xs">
          <p>© 2026 Kizil Elma Talent Meet. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-medium">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Support</span>
          </div>
        </footer>
      </div>
    );
  }

  const filteredStudents = studentGradeFilter === "All"
    ? students
    : students.filter((s) => s.grade === studentGradeFilter);

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Admin Top Header */}
      <header className="glass-card border-b border-amber-500/20 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-title font-bold text-lg text-amber-300 leading-tight">
                Kizil Elma Admin Control
              </h1>
              <p className="text-[10px] text-slate-400">
                Live Score Logging & Grade Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8 space-y-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          <button
            onClick={() => changeAdminTab("results")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "results"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Enter Results</span>
          </button>

          <button
            onClick={() => changeAdminTab("quickscore")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "quickscore"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-950" />
            <span>Quick Score (+1, +2, +3, +4, +5, +10)</span>
          </button>

          <button
            onClick={() => changeAdminTab("programs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "programs"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Programs & Grades</span>
          </button>

          <button
            onClick={() => changeAdminTab("teams")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "teams"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Teams ({teams.length})</span>
          </button>

          <button
            onClick={() => changeAdminTab("students")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "students"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students ({students.length})</span>
          </button>

          <button
            onClick={() => changeAdminTab("slideshow")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "slideshow"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Slideshow ({slideshowImages.length})</span>
          </button>

          <button
            onClick={() => changeAdminTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === "settings"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Settings & Zero Reset</span>
          </button>
        </div>

        {/* Global Feedback Message */}
        {resultSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 max-w-2xl mx-auto shadow-lg animate-pulse">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{resultSuccessMsg}</span>
          </div>
        )}

        {/* TAB 1: Enter Results */}
        {activeAdminTab === "results" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-6 space-y-6 border border-amber-500/30">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-amber-200">
                    Log Program Winners & Grade Results
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Search program, add multiple 1st/2nd/3rd place winners (supports shared 1st/2nd/3rd ties!), set Grade options (A, B, C, D, No Grade) & points. Newly submitted results auto-reveal, move to the top of the public Results section, and recalculate scores live!
                </p>
              </div>

              <form onSubmit={handleSaveResults} className="space-y-6">
                {/* 1. Select Program / Event with Search & Bracket Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                    <span>1. Select Program / Event</span>
                    <span className="text-[10px] text-slate-400">Total Programs: {programs.length}</span>
                  </label>

                  {/* Bracket / Category Quick Filters */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Filter:</span>
                    {["All", "General", "Sanaviyya", "Bakalooriyya", "Stage", "Off-Stage"].map((filter) => {
                      const isActive = adminProgBracketFilter === filter;
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setAdminProgBracketFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? "bg-amber-500 text-slate-950 shadow-md"
                              : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                          }`}
                        >
                          {filter}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Type to search program by name, grade (Sanaviyya, Bakalooriyya), category..."
                      value={programSearch}
                      onChange={(e) => setProgramSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-slate-100 focus:outline-none focus:border-amber-400 mb-2"
                    />
                    {programSearch && (
                      <button
                        type="button"
                        onClick={() => setProgramSearch("")}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedProgId}
                    onChange={(e) => handleProgSelect(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-sm font-bold text-amber-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Choose Program / Event --</option>
                    {programs
                      .filter((p) => {
                        const query = programSearch.trim().toLowerCase();
                        const matchesSearch =
                          !query ||
                          p.name.toLowerCase().includes(query) ||
                          p.category.toLowerCase().includes(query) ||
                          (p.grade && p.grade.toLowerCase().includes(query)) ||
                          p.id.toLowerCase().includes(query);

                        const matchesFilter =
                          adminProgBracketFilter === "All" ||
                          (adminProgBracketFilter === "General" && (p.category === "General" || p.grade === "General" || p.id.startsWith("gen-"))) ||
                          (adminProgBracketFilter === "Sanaviyya" && (p.grade === "Sanaviyya" || p.grade === "A" || p.name.includes("Sanaviyya") || p.name.includes("Bracket A") || p.id.startsWith("san-"))) ||
                          (adminProgBracketFilter === "Bakalooriyya" && (p.grade === "Bakalooriyya" || p.grade === "Bakalooria" || p.grade === "B" || p.name.includes("Bakalooriyya") || p.name.includes("Bakalooria") || p.name.includes("Bracket B") || p.id.startsWith("bak-"))) ||
                          (adminProgBracketFilter === "Stage" && p.category === "Stage") ||
                          (adminProgBracketFilter === "Off-Stage" && p.category === "Off-Stage");

                        return matchesSearch && matchesFilter;
                      })
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} [{p.category}{p.grade ? ` • ${p.grade}` : ""}] {p.is_revealed ? "✓ Revealed" : "(Hidden)"}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 2. Winners & Grade Setup Rows (Multiple 1st, 2nd, 3rd, or Grade Winners) */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      2. Event Winners & Grade Setup ({winnerRows.length} entries)
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => addWinnerRow(1)}
                        className="px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[11px] font-bold hover:bg-yellow-500/30 transition-all"
                      >
                        + Add 🥇 1st Place
                      </button>
                      <button
                        type="button"
                        onClick={() => addWinnerRow(2)}
                        className="px-2.5 py-1 rounded-lg bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[11px] font-bold hover:bg-slate-500/30 transition-all"
                      >
                        + Add 🥈 2nd Place
                      </button>
                      <button
                        type="button"
                        onClick={() => addWinnerRow(3)}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-bold hover:bg-orange-500/30 transition-all"
                      >
                        + Add 🥉 3rd Place
                      </button>
                    </div>
                  </div>

                  {winnerRows.map((row, index) => {
                    const isFirst = row.position === 1;
                    const isSecond = row.position === 2;
                    const isThird = row.position === 3;

                    const selectedProg = programs.find((p) => p.id === selectedProgId);
                    const isGeneralProg = selectedProg ? (selectedProg.category === "General" || selectedProg.grade === "General" || selectedProg.id.startsWith("gen-")) : false;

                    const rowBg = isFirst
                      ? "bg-amber-500/10 border-amber-500/30"
                      : isSecond
                      ? "bg-slate-800/40 border-slate-500/30"
                      : isThird
                      ? "bg-orange-950/20 border-orange-500/30"
                      : "bg-blue-950/20 border-blue-500/30";

                    const rowBadgeColor = isFirst
                      ? "text-yellow-400"
                      : isSecond
                      ? "text-slate-300"
                      : isThird
                      ? "text-orange-400"
                      : "text-blue-400";

                    const matchingStudents = students;

                    return (
                      <div key={row.id} className={`p-4 rounded-xl border ${rowBg} space-y-3 transition-all`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black uppercase tracking-wider ${rowBadgeColor} flex items-center gap-1.5`}>
                            <span>Entry #{index + 1}:</span>
                            <span>
                              {isFirst
                                ? "🥇 1st Place Winner"
                                : isSecond
                                ? "🥈 2nd Place Winner"
                                : isThird
                                ? "🥉 3rd Place Winner"
                                : "🎖️ Grade / Participation Winner"}
                            </span>
                          </span>
                          {winnerRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWinnerRow(row.id)}
                              className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                          {/* Position / Status Selector */}
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Status / Position</label>
                            <select
                              value={row.position === null ? "grade" : row.position}
                              onChange={(e) => {
                                const val = e.target.value;
                                const pos = val === "grade" ? null : (Number(val) as 1 | 2 | 3);
                                updateWinnerRow(row.id, "position", pos);

                                const prog = programs.find((p) => p.id === selectedProgId);
                                if (pos === 1) updateWinnerRow(row.id, "points", prog?.points_1st || 15);
                                else if (pos === 2) updateWinnerRow(row.id, "points", prog?.points_2nd || 10);
                                else if (pos === 3) updateWinnerRow(row.id, "points", prog?.points_3rd || 5);
                                else updateWinnerRow(row.id, "points", 5);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                            >
                              <option value="1">🥇 1st Place</option>
                              <option value="2">🥈 2nd Place</option>
                              <option value="3">🥉 3rd Place</option>
                              <option value="grade">🎖️ Grade Winner</option>
                            </select>
                          </div>

                          {/* Student Select OR Group Select (General Programmes) */}
                          <div className="sm:col-span-2">
                            {isGeneralProg ? (
                              <div>
                                <label className="text-[10px] text-amber-300 font-bold block mb-1 flex items-center justify-between">
                                  <span>🏆 Group / Team Winner (General Programme)</span>
                                  <span className="text-[9px] text-amber-400 font-bold">Team Score Points</span>
                                </label>
                                <select
                                  value={row.studentId}
                                  onChange={(e) => updateWinnerRow(row.id, "studentId", e.target.value)}
                                  required
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-400 text-xs font-bold text-amber-200 focus:outline-none focus:border-amber-300"
                                >
                                  <option value="">-- Select Group / Team --</option>
                                  {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      Group: {t.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <>
                                <label className="text-[10px] text-slate-400 block mb-1 flex items-center justify-between">
                                  <span>Student Winner (All Groups)</span>
                                  <span className="text-[9px] text-amber-300 font-bold">{matchingStudents.length} available</span>
                                </label>
                            {/* Searchable Autocomplete Dropdown */}
                            {(() => {
                              const selectedStudent = students.find((s) => s.id === row.studentId);
                              const selectedTeam = selectedStudent ? teams.find((t) => t.id === selectedStudent.team_id) : null;
                              const rowSearchKey = row.id;
                              const rowSearchValue = rowStudentSearches[rowSearchKey] ?? "";
                              const isOpen = openRowSearch === rowSearchKey;

                              // Filter students based on per-row search query + group/global filters
                              const q = rowSearchValue.toLowerCase().trim();
                              const autocompleteStudents = matchingStudents.filter((s) => {
                                if (!q) return true;
                                return (
                                  s.name.toLowerCase().includes(q) ||
                                  (s.chest_no ? String(s.chest_no).includes(q) : false)
                                );
                              });

                              return (
                                <div className="relative">
                                  {/* Hidden required input for form validation */}
                                  <input type="hidden" value={row.studentId} required />

                                  {/* Search input */}
                                  <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      type="text"
                                      placeholder={
                                        selectedStudent
                                          ? `${selectedStudent.chest_no ? `#${selectedStudent.chest_no} - ` : ""}${selectedStudent.name} (${selectedTeam?.name || "?"})`
                                          : "🔍 Type name or chest # to search..."
                                      }
                                      value={isOpen ? rowSearchValue : ""}
                                      onFocus={() => {
                                        setOpenRowSearch(rowSearchKey);
                                        setRowStudentSearches((prev) => ({ ...prev, [rowSearchKey]: "" }));
                                      }}
                                      onChange={(e) => {
                                        setRowStudentSearches((prev) => ({ ...prev, [rowSearchKey]: e.target.value }));
                                        if (!isOpen) setOpenRowSearch(rowSearchKey);
                                      }}
                                      onBlur={() => {
                                        // Delay close to allow click on suggestion
                                        setTimeout(() => setOpenRowSearch(null), 200);
                                      }}
                                      className={`w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900 border text-xs focus:outline-none font-semibold transition-all ${
                                        row.studentId
                                          ? "border-emerald-500/50 text-emerald-300"
                                          : "border-amber-500/40 text-slate-100"
                                      } ${isOpen ? "border-amber-400 ring-1 ring-amber-400/30" : ""}`}
                                    />
                                    {/* Selected indicator / clear button */}
                                    {row.studentId && !isOpen && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateWinnerRow(row.id, "studentId", "");
                                          setOpenRowSearch(rowSearchKey);
                                          setRowStudentSearches((prev) => ({ ...prev, [rowSearchKey]: "" }));
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-700 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                                        title="Clear selection"
                                      >
                                        <X className="w-3 h-3 text-slate-300" />
                                      </button>
                                    )}
                                    {row.studentId && !isOpen && (
                                      <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-300 truncate max-w-[calc(100%-4.5rem)] pointer-events-none">
                                        ✓ {selectedStudent?.chest_no ? `#${selectedStudent.chest_no} - ` : ""}{selectedStudent?.name} ({selectedTeam?.name || "?"})
                                      </span>
                                    )}
                                  </div>

                                  {/* Dropdown suggestions */}
                                  {isOpen && (
                                    <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-52 overflow-y-auto rounded-xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-black/50">
                                      {autocompleteStudents.length === 0 ? (
                                        <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                          No students found matching &quot;{rowSearchValue}&quot;
                                        </div>
                                      ) : (
                                        teams.map((t) => {
                                          const groupStuds = autocompleteStudents.filter((s) => s.team_id === t.id);
                                          if (groupStuds.length === 0) return null;
                                          return (
                                            <div key={t.id}>
                                              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-950/60 sticky top-0 border-b border-white/5">
                                                {t.name} ({groupStuds.length})
                                              </div>
                                              {groupStuds.map((s) => {
                                                const isSelected = row.studentId === s.id;
                                                return (
                                                  <button
                                                    key={s.id}
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => {
                                                      updateWinnerRow(row.id, "studentId", s.id);
                                                      setOpenRowSearch(null);
                                                      setRowStudentSearches((prev) => ({ ...prev, [rowSearchKey]: "" }));
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-all flex items-center gap-2 ${
                                                      isSelected
                                                        ? "bg-emerald-500/20 text-emerald-300"
                                                        : "text-slate-200 hover:bg-amber-500/15 hover:text-amber-200"
                                                    }`}
                                                  >
                                                    {isSelected && <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                                    <span className="truncate">
                                                      {s.chest_no ? `#${s.chest_no} - ` : ""}{s.name}
                                                    </span>
                                                    {isSelected && <span className="ml-auto text-[10px] text-emerald-400 font-bold shrink-0">Selected</span>}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                              </>
                            )}
                          </div>



                          {/* Points Option */}
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Points Option</label>
                            <input
                              type="number"
                              placeholder="Pts"
                              value={row.points}
                              onChange={(e) => updateWinnerRow(row.id, "points", e.target.value ? Number(e.target.value) : "")}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          {/* Grade Option */}
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Grade</label>
                            <select
                              value={row.grade || ""}
                              onChange={(e) => {
                                const selectedGrade = e.target.value;
                                updateWinnerRow(row.id, "grade", selectedGrade);
                                if (row.position === null && selectedGrade) {
                                  const prog = programs.find((p) => p.id === selectedProgId);
                                  if (selectedGrade === "A") updateWinnerRow(row.id, "points", prog?.points_A || 5);
                                  else if (selectedGrade === "B") updateWinnerRow(row.id, "points", prog?.points_B || 3);
                                  else if (selectedGrade === "C") updateWinnerRow(row.id, "points", prog?.points_C || 2);
                                  else if (selectedGrade === "D") updateWinnerRow(row.id, "points", prog?.points_D || 1);
                                }
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                            >
                              <option value="">No Grade</option>
                              <option value="A">Grade A</option>
                              <option value="B">Grade B</option>
                              <option value="C">Grade C</option>
                              <option value="D">Grade D</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => addWinnerRow(1)}
                    className="w-full py-3 rounded-xl border border-dashed border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Winner (Multiple 1st, 2nd, 3rd, or Grade Winners)</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-base hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-500/20 active:scale-98"
                >
                  Publish Results & Auto-Reveal to Top 🚀
                </button>
              </form>
            </div>

            {/* ALL SUBMITTED RESULTS - Edit & Cancel Section */}
            <div className="glass-card rounded-2xl p-6 space-y-5 border border-slate-500/30">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-blue-200">
                    All Submitted Results ({results.length})
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  View, edit, or cancel (delete) any previously submitted result. Click Edit to modify position, grade, student, or points. Click Cancel to remove a result.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by program name, student name, or chest #..."
                    value={allResultsSearch}
                    onChange={(e) => setAllResultsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5">Group:</span>
                  {["All", ...teams.map((t) => t.id)].map((tId) => {
                    const teamObj = teams.find((t) => t.id === tId);
                    const label = teamObj ? teamObj.name : "All";
                    const isActive = allResultsGroupFilter === tId;
                    return (
                      <button
                        key={tId}
                        type="button"
                        onClick={() => setAllResultsGroupFilter(tId)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                          isActive
                            ? "bg-blue-500 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Results List */}
              {results.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No results submitted yet. Use the form above to log winners.
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {results
                    .filter((r) => {
                      const prog = programs.find((p) => p.id === r.program_id);
                      const stud = students.find((s) => s.id === r.student_id);
                      const q = allResultsSearch.toLowerCase().trim();
                      const matchesSearch =
                        !q ||
                        (prog?.name || "").toLowerCase().includes(q) ||
                        (stud?.name || "").toLowerCase().includes(q) ||
                        (stud?.chest_no ? String(stud.chest_no).includes(q) : false);
                      const matchesGroup =
                        allResultsGroupFilter === "All" ||
                        stud?.team_id === allResultsGroupFilter;
                      return matchesSearch && matchesGroup;
                    })
                    .map((r) => {
                      const prog = programs.find((p) => p.id === r.program_id);
                      const stud = students.find((s) => s.id === r.student_id);
                      const team = stud ? teams.find((t) => t.id === stud.team_id) : null;
                      const isEditing = editingResultId === r.id;

                      const posLabel = r.position === 1 ? "🥇 1st" : r.position === 2 ? "🥈 2nd" : r.position === 3 ? "🥉 3rd" : "🎖️ Grade";
                      const posBg = r.position === 1 ? "bg-amber-500/15 border-amber-500/30" : r.position === 2 ? "bg-slate-700/30 border-slate-500/30" : r.position === 3 ? "bg-orange-900/20 border-orange-500/30" : "bg-blue-950/20 border-blue-500/30";

                      if (isEditing) {
                        return (
                          <div key={r.id} className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-3 animate-pulse-slow">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Edit className="w-3.5 h-3.5" />
                                Editing Result
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{r.id.slice(0, 20)}...</span>
                            </div>

                            <div className="text-xs text-slate-300 font-semibold">
                              Program: <span className="text-amber-300">{prog?.name || r.program_id}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              {/* Position */}
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">Position</label>
                                <select
                                  value={editResultPosition === null ? "grade" : editResultPosition}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditResultPosition(val === "grade" ? null : (Number(val) as 1 | 2 | 3));
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-500/40 text-xs font-bold text-blue-300 focus:outline-none focus:border-blue-400"
                                >
                                  <option value="1">🥇 1st Place</option>
                                  <option value="2">🥈 2nd Place</option>
                                  <option value="3">🥉 3rd Place</option>
                                  <option value="grade">🎖️ Grade</option>
                                </select>
                              </div>

                              {/* Student */}
                              <div className="sm:col-span-1">
                                <label className="text-[10px] text-slate-400 block mb-1">Student</label>
                                <select
                                  value={editResultStudentId}
                                  onChange={(e) => setEditResultStudentId(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-500/40 text-xs text-slate-100 focus:outline-none focus:border-blue-400 font-semibold"
                                >
                                  <option value="">-- Select --</option>
                                  {students.map((s) => {
                                    const t = teams.find((tm) => tm.id === s.team_id);
                                    return (
                                      <option key={s.id} value={s.id}>
                                        {s.chest_no ? `#${s.chest_no} ` : ""}{s.name} ({t?.name || "?"})
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>



                              {/* Points */}
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">Points</label>
                                <input
                                  type="number"
                                  value={editResultPoints}
                                  onChange={(e) => setEditResultPoints(Number(e.target.value))}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-500/40 text-xs text-blue-300 font-bold focus:outline-none focus:border-blue-400"
                                />
                              </div>

                              {/* Grade */}
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-1">Grade</label>
                                <select
                                  value={editResultGrade || ""}
                                  onChange={(e) => setEditResultGrade(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-500/40 text-xs text-blue-300 font-bold focus:outline-none focus:border-blue-400"
                                >
                                  <option value="">No Grade</option>
                                  <option value="A">Grade A</option>
                                  <option value="B">Grade B</option>
                                  <option value="C">Grade C</option>
                                  <option value="D">Grade D</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingResultId(null)}
                                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  // Build updated results array
                                  const updatedResults = results.map((res) =>
                                    res.id === r.id
                                      ? {
                                          ...res,
                                          student_id: editResultStudentId || res.student_id,
                                          position: editResultPosition,
                                          grade: editResultGrade,
                                          points_awarded: editResultPoints,
                                        }
                                      : res
                                  );
                                  // Use saveProgramResults approach: rebuild all results for this program
                                  const progId = r.program_id;
                                  const otherResults = updatedResults.filter((res) => res.program_id !== progId);
                                  const thisProgResults = updatedResults.filter((res) => res.program_id === progId);
                                  await saveProgramResults(
                                    progId,
                                    thisProgResults.map((res) => ({
                                      studentId: res.student_id,
                                      position: res.position,
                                      grade: res.grade,
                                      points: res.points_awarded,
                                    }))
                                  );
                                  setEditingResultId(null);
                                  setResultSuccessMsg("Result updated successfully! ✅");
                                  setTimeout(() => setResultSuccessMsg(""), 4000);
                                }}
                                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-400 transition-colors flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Save Changes
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={r.id} className={`p-3 rounded-xl border ${posBg} flex items-center justify-between gap-3 group hover:border-blue-400/40 transition-all`}>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Position Badge */}
                            <div className="text-sm font-black shrink-0 w-16 text-center">
                              {posLabel}
                            </div>

                            {/* Student Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-100 truncate">
                                  {stud ? `${stud.chest_no ? `#${stud.chest_no} ` : ""}${stud.name}` : "Unknown Student"}
                                </span>
                                {team && (
                                  <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ backgroundColor: team.color + "25", color: team.color, border: `1px solid ${team.color}50` }}
                                  >
                                    {team.name}
                                  </span>
                                )}

                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="text-[10px] text-slate-400 truncate">
                                  {prog?.name || r.program_id}
                                </span>
                                {prog && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                      prog.is_revealed
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                    }`}
                                  >
                                    {prog.is_revealed ? "Revealed" : "Hidden"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Points */}
                            <div className="text-right shrink-0">
                              <span className="text-sm font-black text-amber-300">
                                +{r.points_awarded}
                              </span>
                              <span className="text-[10px] text-slate-500 block">pts</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                            {/* Reveal / Hide Toggle */}
                            {prog && (
                              <button
                                type="button"
                                onClick={async () => {
                                  await toggleProgramReveal(prog.id);
                                  setResultSuccessMsg(
                                    prog.is_revealed
                                      ? `Program "${prog.name}" results HIDDEN from public view 🙈`
                                      : `Program "${prog.name}" results REVEALED to public view 👁️`
                                  );
                                  setTimeout(() => setResultSuccessMsg(""), 4000);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 border ${
                                  prog.is_revealed
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                                    : "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                                }`}
                                title={prog.is_revealed ? "Click to Hide this program from public view" : "Click to Reveal this program to public view"}
                              >
                                {prog.is_revealed ? (
                                  <>
                                    <Eye className="w-3 h-3 text-emerald-400" />
                                    <span>Revealed</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3 text-amber-400" />
                                    <span>Hidden</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingResultId(r.id);
                                setEditResultPosition(r.position || null);
                                setEditResultGrade(r.grade || "");
                                setEditResultPoints(r.points_awarded);
                                setEditResultStudentId(r.student_id);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>

                            {/* Cancel */}
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteResult(r.id);
                                setResultSuccessMsg("Result cancelled/deleted successfully! 🗑️");
                                setTimeout(() => setResultSuccessMsg(""), 4000);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 text-[11px] font-bold transition-all flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Quick Score Panel (+1, +2, +3, +4, +5, +10) */}
        {activeAdminTab === "quickscore" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-6 space-y-6 border border-amber-500/30">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-bold text-amber-200">
                    Quick Score Addition Setup
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  1-Click Instant Score Addition (+1, +2, +3, +4, +5, +10 points) directly to any student or team!
                </p>
              </div>

              {/* Student Search & Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-300 block">
                  Search & Select Student to Award Points
                </label>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search student by name or chest # (e.g. Aisha, 101)..."
                    value={quickStudentSearch}
                    onChange={(e) => setQuickStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400 mb-2"
                  />
                </div>

                <select
                  value={quickScoreStudId}
                  onChange={(e) => setQuickScoreStudId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-sm font-bold text-amber-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Choose Student --</option>
                  {students
                    .filter((s) => {
                      const q = quickStudentSearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        s.name.toLowerCase().includes(q) ||
                        (s.chest_no && s.chest_no.toString().includes(q))
                      );
                    })
                    .map((s) => {
                      const t = teams.find((tm) => tm.id === s.team_id);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.chest_no ? `[#${s.chest_no}] ` : ""}{s.name} ({t?.name || "No Team"}) • {s.total_points} pts
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Quick Score Buttons */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Click Points to Award Instantly:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 10].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      disabled={!quickScoreStudId}
                      onClick={() => handleQuickAddPoints(pts)}
                      className="py-3 px-2 rounded-xl bg-gradient-to-b from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-lg transition-all shadow-md flex flex-col items-center justify-center gap-0.5 active:scale-95"
                    >
                      <span>+{pts}</span>
                      <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">
                        {pts === 1 ? "Pt" : "Pts"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Points Award */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Custom points (e.g. 15)"
                  value={customQuickPoints}
                  onChange={(e) => setCustomQuickPoints(e.target.value ? Number(e.target.value) : "")}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400 flex-1"
                />
                <button
                  type="button"
                  disabled={!quickScoreStudId || !customQuickPoints}
                  onClick={() => {
                    if (typeof customQuickPoints === "number") {
                      handleQuickAddPoints(customQuickPoints);
                      setCustomQuickPoints("");
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors shrink-0"
                >
                  Add Custom Points
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Programs & Reveal Toggles & Grade Setup */}
        {activeAdminTab === "programs" && (
          <div className="space-y-6">
            {/* Create New Program */}
            <div className="glass-card rounded-2xl p-5 space-y-4 border border-amber-500/20">
              <h3 className="text-base font-bold text-amber-200">
                Add New Program / Event
              </h3>
              <form
                onSubmit={handleAddProgram}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
              >
                <input
                  type="text"
                  placeholder="Program Name"
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  required
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400 sm:col-span-2"
                />
                <select
                  value={progCat}
                  onChange={(e) => setProgCat(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Stage">Stage</option>
                  <option value="Off-Stage">Off-Stage</option>
                  <option value="Literary">Literary</option>
                  <option value="Fine Arts">Fine Arts</option>
                </select>

                <input
                  type="number"
                  placeholder="1st Pts"
                  value={pts1st}
                  onChange={(e) => setPts1st(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  placeholder="2nd Pts"
                  value={pts2nd}
                  onChange={(e) => setPts2nd(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  placeholder="3rd Pts"
                  value={pts3rd}
                  onChange={(e) => setPts3rd(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1 sm:col-span-2 lg:col-span-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Program</span>
                </button>
              </form>
            </div>

            {/* Programs List with Reveal Toggles & Grades */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <span>Programs & Public Visibility</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                    {programs.filter((p) => {
                      const query = programTabSearch.trim().toLowerCase();
                      const matchesSearch =
                        !query ||
                        p.name.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query) ||
                        (p.grade && p.grade.toLowerCase().includes(query)) ||
                        p.id.toLowerCase().includes(query);
                      const matchesFilter =
                        adminProgBracketFilter === "All" ||
                        (adminProgBracketFilter === "General" && (p.category === "General" || p.grade === "General" || p.id.startsWith("gen-"))) ||
                        (adminProgBracketFilter === "Sanaviyya" && (p.grade === "Sanaviyya" || p.grade === "A" || p.name.includes("Sanaviyya") || p.name.includes("Bracket A") || p.id.startsWith("san-"))) ||
                        (adminProgBracketFilter === "Bakalooriyya" && (p.grade === "Bakalooriyya" || p.grade === "Bakalooria" || p.grade === "B" || p.name.includes("Bakalooriyya") || p.name.includes("Bakalooria") || p.name.includes("Bracket B") || p.id.startsWith("bak-"))) ||
                        (adminProgBracketFilter === "Stage" && p.category === "Stage") ||
                        (adminProgBracketFilter === "Off-Stage" && p.category === "Off-Stage");
                      return matchesSearch && matchesFilter;
                    }).length} of {programs.length}
                  </span>
                </h3>

                <div className="flex flex-wrap items-center gap-1.5">
                  {["All", "General", "Sanaviyya", "Bakalooriyya", "Stage", "Off-Stage"].map((filter) => {
                    const isActive = adminProgBracketFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setAdminProgBracketFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? "bg-amber-500 text-slate-950 shadow-md"
                            : "bg-slate-900 text-slate-400 hover:text-white border border-white/10"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Program Search Input Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search program by name, grade (Sanaviyya, Bakalooriyya), category (Stage/Off-Stage)..."
                  value={programTabSearch}
                  onChange={(e) => setProgramTabSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                {programTabSearch && (
                  <button
                    type="button"
                    onClick={() => setProgramTabSearch("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {programs
                  .filter((p) => {
                    const query = programTabSearch.trim().toLowerCase();
                    const matchesSearch =
                      !query ||
                      p.name.toLowerCase().includes(query) ||
                      p.category.toLowerCase().includes(query) ||
                      (p.grade && p.grade.toLowerCase().includes(query)) ||
                      p.id.toLowerCase().includes(query);

                    const matchesFilter =
                      adminProgBracketFilter === "All" ||
                      (adminProgBracketFilter === "General" && (p.category === "General" || p.grade === "General" || p.id.startsWith("gen-"))) ||
                      (adminProgBracketFilter === "Sanaviyya" && (p.grade === "Sanaviyya" || p.grade === "A" || p.name.includes("Sanaviyya") || p.name.includes("Bracket A") || p.id.startsWith("san-"))) ||
                      (adminProgBracketFilter === "Bakalooriyya" && (p.grade === "Bakalooriyya" || p.grade === "Bakalooria" || p.grade === "B" || p.name.includes("Bakalooriyya") || p.name.includes("Bakalooria") || p.name.includes("Bracket B") || p.id.startsWith("bak-"))) ||
                      (adminProgBracketFilter === "Stage" && p.category === "Stage") ||
                      (adminProgBracketFilter === "Off-Stage" && p.category === "Off-Stage");

                    return matchesSearch && matchesFilter;
                  })
                  .map((p) => (
                  <div
                    key={p.id}
                    className="glass-card rounded-xl p-4 flex items-center justify-between gap-3 border border-white/10 group hover:border-amber-500/30 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {p.grade || "A"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {p.points_1st}/{p.points_2nd}/{p.points_3rd} pts
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 mt-1 truncate">
                        {p.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Edit Program */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditProgram(p)}
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        title="Edit Program"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Program */}
                      <button
                        type="button"
                        onClick={() => setDeletingProgramId(p.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete Program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Reveal Toggle */}
                      <button
                        onClick={() => toggleProgramReveal(p.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          p.is_revealed
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {p.is_revealed ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Revealed</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Edit Modal */}
            {editingProgram && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-lg rounded-2xl p-6 space-y-4 border border-blue-500/40">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-200">
                      Edit Program
                    </h3>
                    <button
                      onClick={() => setEditingProgram(null)}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedProgram} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Program Name
                      </label>
                      <input
                        type="text"
                        value={editProgName}
                        onChange={(e) => setEditProgName(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Category
                        </label>
                        <select
                          value={editProgCat}
                          onChange={(e) => setEditProgCat(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                        >
                          <option value="Stage">Stage</option>
                          <option value="Off-Stage">Off-Stage</option>
                          <option value="General">General</option>
                          <option value="Literary">Literary</option>
                          <option value="Fine Arts">Fine Arts</option>
                        </select>
                      </div>


                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          1st Place Points
                        </label>
                        <input
                          type="number"
                          value={editPts1st}
                          onChange={(e) => setEditPts1st(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          2nd Place Points
                        </label>
                        <input
                          type="number"
                          value={editPts2nd}
                          onChange={(e) => setEditPts2nd(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          3rd Place Points
                        </label>
                        <input
                          type="number"
                          value={editPts3rd}
                          onChange={(e) => setEditPts3rd(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProgram(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-400 flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Program Delete Confirmation Modal */}
            {deletingProgramId && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 border border-red-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-red-200">
                        Delete Program?
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Are you sure you want to delete <strong className="text-red-300">&quot;{programs.find((p) => p.id === deletingProgramId)?.name || "Unknown"}&quot;</strong>? This will also remove all results for this program. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDeletingProgramId(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteProgram}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Yes, Delete Program
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Teams */}
        {activeAdminTab === "teams" && (
          <div className="space-y-6">
            {/* Create New Team */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-amber-200">
                Create New Team
              </h3>
              <form
                onSubmit={handleAddTeam}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <input
                  type="text"
                  placeholder="Team Name (e.g. Phoenix)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={teamColor}
                    onChange={(e) => setTeamColor(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Hex Color (#EF4444)"
                    value={teamColor}
                    onChange={(e) => setTeamColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team</span>
                </button>
              </form>
            </div>

            {/* Teams List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="glass-card rounded-xl p-4 space-y-3 group hover:border-amber-500/30 transition-all"
                  style={{ borderLeft: `4px solid ${t.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <TeamLogoAvatar
                      team={t}
                      size={40}
                      borderRadius={12}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-100 truncate">{t.name}</h4>
                      <p className="text-xs text-amber-400 font-bold">
                        {t.total_score} Points
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEditTeam(t)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-bold transition-all shrink-0 flex items-center gap-1 border border-blue-500/30"
                      title="Edit Team Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Edit Modal */}
            {editingTeam && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 border border-blue-500/40">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-200">
                      Edit Team Profile
                    </h3>
                    <button
                      onClick={() => setEditingTeam(null)}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedTeam} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Team Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={editTeamColor}
                          onChange={(e) => setEditTeamColor(e.target.value)}
                          className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Hex Color (#EF4444)"
                          value={editTeamColor}
                          onChange={(e) => setEditTeamColor(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                        />
                        <div
                          className="w-10 h-10 rounded-xl border border-white/20 shrink-0"
                          style={{ backgroundColor: editTeamColor }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Logo URL (optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={editTeamLogo}
                        onChange={(e) => setEditTeamLogo(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                      />

                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingTeam(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-400 flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Students & Profile Picture Customization & Grade Setup */}
        {activeAdminTab === "students" && (
          <div className="space-y-6">
            {/* Register New Student Form */}
            <div className="glass-card rounded-2xl p-5 space-y-4 border border-amber-500/20">
              <h3 className="text-base font-bold text-amber-200">
                Register New Student
              </h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Student Full Name</label>
                    <input
                      type="text"
                      placeholder="Student Full Name"
                      value={studName}
                      onChange={(e) => setStudName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Assign Team / Group</label>
                    <select
                      value={studTeamId}
                      onChange={(e) => setStudTeamId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="">-- Assign Team --</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Chest No. (optional)</label>
                    <input
                      type="number"
                      placeholder="Chest # (e.g. 101)"
                      value={studChestNo}
                      onChange={(e) => setStudChestNo(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Profile Picture Option */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Profile Picture Options:
                  </label>

                  {/* Upload from Device */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-dashed border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">Upload from Device</span>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={registerFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setStudPhoto, setStudUploadedFileName)}
                    />

                    {/* Upload preview or button */}
                    {studUploadedFileName ? (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <img
                          src={studPhoto}
                          alt="Preview"
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-emerald-300 truncate">{studUploadedFileName}</p>
                          <p className="text-[10px] text-slate-400">Uploaded successfully</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cancelUpload(setStudPhoto, setStudUploadedFileName, UNKNOWN_PERSON_AVATAR, registerFileInputRef)}
                          className="p-1.5 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-all shrink-0"
                          title="Cancel upload"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => registerFileInputRef.current?.click()}
                        className="w-full py-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Click to Upload Photo from Device</span>
                      </button>
                    )}
                    <p className="text-[10px] text-slate-500">Supports JPG, PNG, GIF, WebP (max 40MB)</p>
                  </div>
                  
                  {/* Avatar Presets */}
                  <div className="flex flex-wrap items-center gap-3">
                    {AVATAR_PRESETS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetAvatar(av.url);
                          setStudPhoto(av.url);
                          setStudUploadedFileName("");
                        }}
                        className={`p-1.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                          studPhoto === av.url && !studUploadedFileName
                            ? "bg-amber-500/20 border-amber-400 text-amber-200"
                            : "bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-7 h-7 rounded-full object-cover bg-slate-800" />
                        <span className="text-[11px] font-medium">{av.label}</span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    placeholder="Or paste custom Image/Photo URL..."
                    value={studUploadedFileName ? "" : studPhoto}
                    onChange={(e) => {
                      setStudPhoto(e.target.value);
                      setStudUploadedFileName("");
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Student</span>
                </button>
              </form>
            </div>

            {/* Students List Filter & Cards */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-300">
                  Registered Students ({
                    students.filter((s) => {
                      const matchesGrade = studentGradeFilter === "All" || (s.grade || "A") === studentGradeFilter;
                      const q = rosterStudentSearch.toLowerCase().trim();
                      const matchesSearch = !q || s.name.toLowerCase().includes(q) || (s.chest_no && s.chest_no.toString().includes(q));
                      return matchesGrade && matchesSearch;
                    }).length
                  })
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Roster Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search student or chest #..."
                      value={rosterStudentSearch}
                      onChange={(e) => setRosterStudentSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>


                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {students
                  .filter((s) => {
                    const q = rosterStudentSearch.toLowerCase().trim();
                    const matchesSearch = !q || s.name.toLowerCase().includes(q) || (s.chest_no && s.chest_no.toString().includes(q));
                    return matchesSearch;
                  })
                  .map((s) => {
                  const t = teams.find((tm) => tm.id === s.team_id);
                  const isCustomPhoto = s.photo_url && s.photo_url !== UNKNOWN_PERSON_AVATAR && !AVATAR_PRESETS.some((av) => av.url === s.photo_url);
                  return (
                    <div
                      key={s.id}
                      className="glass-card rounded-xl p-3 flex items-center justify-between gap-3 border border-white/10 group hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Profile photo with upload overlay */}
                        <div className="relative shrink-0 group/photo">
                          <img
                            src={s.photo_url || UNKNOWN_PERSON_AVATAR}
                            alt={s.name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10 bg-slate-900"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = UNKNOWN_PERSON_AVATAR;
                            }}
                          />
                          {/* Upload overlay on hover */}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`upload-photo-${s.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (!file.type.startsWith("image/")) {
                                setResultSuccessMsg("❌ Please select an image file");
                                setTimeout(() => setResultSuccessMsg(""), 3000);
                                return;
                              }
                              if (file.size > 40 * 1024 * 1024) {
                                setResultSuccessMsg("❌ Image too large! Max 40MB");
                                setTimeout(() => setResultSuccessMsg(""), 3000);
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = async (event) => {
                                try {
                                  // Compress to small avatar size before saving to Firestore
                                  const compressed = await compressImageFile(file, 400, 400, 0.72);
                                  await updateStudent(s.id, { photo_url: compressed });
                                  setResultSuccessMsg(`✅ Photo updated for ${s.name}!`);
                                } catch {
                                  // Fallback: use raw base64 if compression fails
                                  const base64 = event.target?.result as string;
                                  await updateStudent(s.id, { photo_url: base64 });
                                  setResultSuccessMsg(`✅ Photo updated for ${s.name}!`);
                                }
                                setTimeout(() => setResultSuccessMsg(""), 3000);
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`upload-photo-${s.id}`) as HTMLInputElement;
                              input?.click();
                            }}
                            className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                            title="Upload photo"
                          >
                            <Upload className="w-4 h-4 text-white" />
                          </button>
                          {/* Cancel photo badge */}
                          {isCustomPhoto && (
                            <button
                              type="button"
                              onClick={async () => {
                                await updateStudent(s.id, { photo_url: UNKNOWN_PERSON_AVATAR });
                                setResultSuccessMsg(`Photo removed for ${s.name}`);
                                setTimeout(() => setResultSuccessMsg(""), 3000);
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all hover:bg-red-400"
                              title="Remove photo"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-slate-100 truncate">{s.chest_no ? `#${s.chest_no} ` : ""}{s.name}</h4>

                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 block truncate">
                            {t?.name || "No Team"} • <strong className="text-amber-400">{s.total_points} pts</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Quick upload button */}
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(`upload-photo-${s.id}`) as HTMLInputElement;
                            input?.click();
                          }}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="Upload Profile Photo"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditStudent(s)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Edit Student Profile Picture & Grade"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(s)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Edit Student Profile Modal */}
            {editingStudent && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-lg rounded-2xl p-6 space-y-4 border border-amber-500/40">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-amber-200">
                      Edit Student Profile
                    </h3>
                    <button
                      onClick={() => setEditingStudent(null)}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedStudent} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editStudName}
                        onChange={(e) => setEditStudName(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Assign Team
                        </label>
                        <select
                          value={editStudTeamId}
                          onChange={(e) => setEditStudTeamId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        >
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Chest No.
                        </label>
                        <input
                          type="number"
                          placeholder="Chest #"
                          value={editStudChestNo}
                          onChange={(e) => setEditStudChestNo(e.target.value ? Number(e.target.value) : "")}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Photo Edit Options */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Profile Picture
                      </label>

                      {/* Upload from Device */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-dashed border-amber-500/30 space-y-3">
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-amber-300">Upload from Device</span>
                        </div>

                        {/* Hidden file input */}
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setEditStudPhoto, setEditUploadedFileName)}
                        />

                        {/* Upload preview or button */}
                        {editUploadedFileName ? (
                          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <img
                              src={editStudPhoto}
                              alt="Preview"
                              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/50 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-emerald-300 truncate">{editUploadedFileName}</p>
                              <p className="text-[10px] text-slate-400">Uploaded</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => cancelUpload(setEditStudPhoto, setEditUploadedFileName, editingStudent?.photo_url || UNKNOWN_PERSON_AVATAR, editFileInputRef)}
                              className="p-1.5 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-all shrink-0"
                              title="Cancel upload"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Click to Upload Photo from Device</span>
                          </button>
                        )}
                        <p className="text-[10px] text-slate-500">Supports JPG, PNG, GIF, WebP (max 40MB)</p>
                      </div>

                      {/* Current Photo Preview */}
                      {editStudPhoto && !editUploadedFileName && (
                        <div className="flex items-center gap-3">
                          <img
                            src={editStudPhoto}
                            alt="Current"
                            className="w-10 h-10 rounded-full object-cover border border-white/20 bg-slate-800"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = UNKNOWN_PERSON_AVATAR;
                            }}
                          />
                          <span className="text-[10px] text-slate-400">Current photo</span>
                        </div>
                      )}

                      {/* Avatar Presets for Edit */}
                      <div className="flex flex-wrap items-center gap-2">
                        {AVATAR_PRESETS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              setEditStudPhoto(av.url);
                              setEditUploadedFileName("");
                            }}
                            className={`p-1.5 rounded-lg border text-[10px] flex items-center gap-1.5 ${
                              editStudPhoto === av.url && !editUploadedFileName
                                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                                : "bg-slate-900 border-white/10 text-slate-400"
                            }`}
                          >
                            <img src={av.url} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span>{av.label.split(" ")[0]}</span>
                          </button>
                        ))}
                      </div>

                      <input
                        type="url"
                        placeholder="Or paste custom Image/Photo URL..."
                        value={editUploadedFileName ? "" : editStudPhoto}
                        onChange={(e) => {
                          setEditStudPhoto(e.target.value);
                          setEditUploadedFileName("");
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Student Delete Confirmation Modal */}
            {deletingStudent && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 border border-red-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      <UserX className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-red-200">
                        Delete Student?
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Are you sure you want to delete <strong className="text-red-300">&quot;{deletingStudent.chest_no ? `#${deletingStudent.chest_no} ` : ""}{deletingStudent.name}&quot;</strong>? This will also remove all their results and scores. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDeletingStudent(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteStudent}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Yes, Delete Student
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



        {/* TAB 6: Mosaic Gallery & Image Slideshow Manager */}
        {activeAdminTab === "slideshow" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  Mosaic Gallery & Auto-Sliding Card Manager
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit, or delete Pinterest-style cards with multiple auto-sliding photo slides, custom aspect ratios, and category tags
                </p>
              </div>

              <button
                onClick={handleOpenAddSlide}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Gallery Card</span>
              </button>
            </div>

            {/* Slides Grid */}
            {slideshowImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {slideshowImages.map((slide, idx) => {
                  const slideCount = slide.images && slide.images.length > 0 ? slide.images.length : 1;
                  return (
                    <div
                      key={slide.id || idx}
                      className="glass-card rounded-2xl p-4 space-y-3 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Curved Thumbnail */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                          <img
                            src={slide.image_url}
                            alt={slide.title || "Slide"}
                            className="w-full h-full object-cover"
                          />
                          {slide.category && (
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white font-extrabold text-[10px] uppercase border border-white/20">
                              {slide.category}
                            </span>
                          )}
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-black text-[10px]">
                            {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
                          </span>
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-slate-100 truncate">
                              {slide.title || "Untitled Card"}
                            </h4>
                            <span className="text-[10px] font-mono text-amber-300 uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 shrink-0">
                              {slide.aspect_ratio || "portrait"}
                            </span>
                          </div>
                          {slide.subtitle && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {slide.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => handleOpenEditSlide(slide)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingSlideId(slide.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400 font-semibold">
                  No gallery cards found. Click &quot;Add New Gallery Card&quot; to create photo sliders!
                </p>
              </div>
            )}

            {/* Add / Edit Slide Modal */}
            {isSlideModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-lg rounded-2xl p-6 space-y-4 border border-amber-500/40 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-amber-400" />
                      {editingSlideId ? "Edit Gallery Card" : "Add New Gallery Card"}
                    </h3>
                    <button
                      onClick={() => setIsSlideModalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSlide} className="space-y-4">
                    {/* Device Upload or URL for Primary Cover */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">
                        Primary Cover Photo (Upload or Paste URL)
                      </label>

                      {slideFileName ? (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                          <img
                            src={slideImageUrl}
                            alt="Preview"
                            className="w-10 h-10 rounded-lg object-cover border border-emerald-400/50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-emerald-300 truncate">{slideFileName}</p>
                            <p className="text-[10px] text-slate-400">Uploaded from device</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => cancelUpload(setSlideImageUrl, setSlideFileName, "", slideFileInputRef)}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => slideFileInputRef.current?.click()}
                          className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Click to Upload Photo from Device</span>
                        </button>
                      )}

                      <input
                        ref={slideFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setSlideImageUrl, setSlideFileName)}
                      />

                      <input
                        type="url"
                        placeholder="Or paste Primary Image URL (https://...)"
                        value={slideFileName ? "" : slideImageUrl}
                        onChange={(e) => {
                          setSlideImageUrl(e.target.value);
                          setSlideFileName("");
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Additional Slide Images for Auto-Sliding inside this Card */}
                    <div className="space-y-2 pt-1 border-t border-white/10">
                      <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>Additional Auto-Sliding Images in Card</span>
                        <span className="text-[10px] text-amber-400 font-normal">
                          {slideExtraUrls.length + 1} Total Slides
                        </span>
                      </label>

                      {slideExtraUrls.map((url, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-white/10">
                          <img src={url} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0" />
                          <input
                            type="text"
                            readOnly
                            value={url}
                            className="flex-1 text-[11px] bg-transparent text-slate-300 truncate focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraSlideUrl(i)}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Paste additional image URL for slideshow..."
                          value={slideExtraInput}
                          onChange={(e) => setSlideExtraInput(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="button"
                          onClick={handleAddExtraSlideUrl}
                          className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold border border-amber-500/40 shrink-0"
                        >
                          + Add Slide
                        </button>
                      </div>

                      {/* Upload Additional Slides from Device */}
                      <button
                        type="button"
                        onClick={() => multipleSlideFileInputRef.current?.click()}
                        className="w-full py-2 rounded-xl border border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-800/70 text-slate-400 hover:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Or Upload Additional Images from Device</span>
                      </button>
                      <input
                        ref={multipleSlideFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleMultipleFileUpload}
                      />
                    </div>

                    {/* Slide Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Card Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Inauguration Ceremony"
                        value={slideTitle}
                        onChange={(e) => setSlideTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Slide Subtitle */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Card Subtitle / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Kizil Elma Stage Performances & Highlights"
                        value={slideSubtitle}
                        onChange={(e) => setSlideSubtitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Category Tag</label>
                        <select
                          value={slideCategory}
                          onChange={(e) => setSlideCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        >
                          <option value="Stage">Stage</option>
                          <option value="Off-Stage">Off-Stage</option>
                          <option value="General">General</option>
                          <option value="Highlights">Highlights</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Card Aspect Ratio Shape</label>
                        <select
                          value={slideAspect}
                          onChange={(e) => setSlideAspect(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        >
                          <option value="portrait">Portrait Rectangular (3:4)</option>
                          <option value="square">Square Box (1:1)</option>
                          <option value="vertical">Vertical Standard (4:5)</option>
                          <option value="tall">Tall Full Screen (9:16)</option>
                          <option value="landscape">Wide Showcase (16:10)</option>
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsSlideModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
                      >
                        {editingSlideId ? "Save Changes" : "Add Gallery Card"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Slide Delete Confirmation Modal */}
            {deletingSlideId && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 border border-red-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-red-200">
                        Remove Gallery Card?
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Are you sure you want to remove this card from the homepage gallery? This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDeletingSlideId(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteSlide}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Yes, Remove Card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: Settings & Zero Reset */}
        {activeAdminTab === "settings" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Zero Points Reset */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-red-500/40 bg-red-950/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-200">
                    Set All Points to Zero across All Areas
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instantly clear all results and reset team total scores and student total points to 0.
                  </p>
                </div>
              </div>

              <button
                onClick={async () => {
                  await resetAllPointsToZero();
                  setResultSuccessMsg("All area points have been successfully set to ZERO (0)!");
                  setTimeout(() => setResultSuccessMsg(""), 4000);
                }}
                className="px-5 py-3 rounded-xl bg-red-600/30 text-red-200 hover:bg-red-600/50 border border-red-500/60 text-xs font-black transition-all flex items-center gap-2 shadow-lg"
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>Set All Area Points to 0 (Zero)</span>
              </button>
            </div>

            {/* Database & Persistence Status */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Database & Data Persistence Status</span>
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    isConfigured
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isConfigured ? "bg-emerald-400 animate-pulse" : "bg-cyan-400"}`} />
                  {isConfigured ? "Firebase Cloud Sync Active" : "LocalStorage Dual Storage Backup Active"}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isConfigured
                  ? "Your app is connected to Firebase Firestore. All results and scores are backed up locally and synced in real-time across all devices."
                  : "Running in LocalStorage Backup Mode. Results and uploaded points are automatically saved in your browser storage so they will not be lost across TV reloads or page refreshes."}
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
                <p className="font-semibold text-amber-300">💡 Firebase Firestore Security Rules Recommendation:</p>
                <p className="text-slate-400 text-[11px]">
                  To prevent Firestore from locking after 30 days (default Test Mode rule expiry), go to your Firebase Console &gt; Firestore Database &gt; Rules and set:
                </p>
                <pre className="p-2 rounded bg-black/60 text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </pre>
              </div>
            </div>

            {/* Demo Data Reset */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-amber-500/20">
              <h3 className="text-base font-bold text-amber-200">
                Demo Setup Reset
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clicking this will populate sample teams (Crimson Falcons, Sapphire Dragons, Emerald Titans, Golden Spartans), students, and programs with Grade setup and zero points.
              </p>
              <button
                onClick={resetToDemoData}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Seed Data</span>
              </button>
            </div>

            {/* Supabase SQL Schema Excerpt */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-200">
                  Supabase PostgreSQL Setup SQL
                </h3>
                <button
                  onClick={copySql}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-[11px] font-mono text-amber-200/90 overflow-x-auto max-h-56 border border-white/10">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
