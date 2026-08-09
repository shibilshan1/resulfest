import { Team, Student, Program, Result } from "@/types";

// Standard Unknown Person Avatar (SVG silhouette)
export const UNKNOWN_PERSON_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=334155&textColor=94a3b8";

export const AVATAR_PRESETS = [
  { id: "unknown-1", label: "Unknown Person (Silhouette)", url: "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=334155&textColor=94a3b8" },
  { id: "unknown-2", label: "Anonymous Avatar A", url: "https://api.dicebear.com/7.x/shapes/svg?seed=PersonA&backgroundColor=1e293b" },
  { id: "unknown-3", label: "Anonymous Avatar B", url: "https://api.dicebear.com/7.x/shapes/svg?seed=PersonB&backgroundColor=0f172a" },
  { id: "unknown-4", label: "Anonymous Avatar C", url: "https://api.dicebear.com/7.x/shapes/svg?seed=PersonC&backgroundColor=312e81" },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: "team-a",
    name: "QUBA",
    color: "#FFFFFF", // White
    total_score: 0,
  },
  {
    id: "team-b",
    name: "JUHFA",
    color: "#38BDF8", // Sky Blue
    total_score: 0,
  },
  {
    id: "team-c",
    name: "KHUDYD",
    color: "#EF4444", // Red
    total_score: 0,
  },
  {
    id: "team-d",
    name: "THAWR",
    color: "#10B981", // Green
    total_score: 0,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // GROUP A (Chest 100 - 119)
  { id: "stud-100", chest_no: 100, name: "ABDUNOOR (L)", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-101", chest_no: 101, name: "HUSSAIN (AL)", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-102", chest_no: 102, name: "SHAHEEB", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-103", chest_no: 103, name: "SHIBIL AMAN", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-104", chest_no: 104, name: "NIHAL CK", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-105", chest_no: 105, name: "RISHAD YP", team_id: "team-a", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-106", chest_no: 106, name: "SALMAN", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-107", chest_no: 107, name: "THAMEEM", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-108", chest_no: 108, name: "SWALIH E", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-109", chest_no: 109, name: "RAZEEN", team_id: "team-a", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-110", chest_no: 110, name: "AL SABITH", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-111", chest_no: 111, name: "HISHAM TP", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-112", chest_no: 112, name: "NABHAN", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-113", chest_no: 113, name: "AMEEN H2", team_id: "team-a", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-114", chest_no: 114, name: "FAYIZ", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-115", chest_no: 115, name: "RIHAN", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-116", chest_no: 116, name: "RIFAD", team_id: "team-a", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-117", chest_no: 117, name: "SAFRAN", team_id: "team-a", grade: "D", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-118", chest_no: 118, name: "MUSTHAFA", team_id: "team-a", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-119", chest_no: 119, name: "FIRDOUS", team_id: "team-a", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },

  // GROUP B (Chest 200 - 218)
  { id: "stud-200", chest_no: 200, name: "JAVAD D4 (L)", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-201", chest_no: 201, name: "SAJID (AL)", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-202", chest_no: 202, name: "THANVEER THANGAL", team_id: "team-b", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-203", chest_no: 203, name: "SHIBIL SHAN", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-204", chest_no: 204, name: "RASHIN", team_id: "team-b", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-205", chest_no: 205, name: "AFSAL", team_id: "team-b", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-206", chest_no: 206, name: "FAHEEM", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-207", chest_no: 207, name: "JUNAID", team_id: "team-b", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-208", chest_no: 208, name: "MUSLIH KV", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-209", chest_no: 209, name: "NAJID", team_id: "team-b", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-210", chest_no: 210, name: "YASEEN", team_id: "team-b", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-211", chest_no: 211, name: "NABEEL", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-212", chest_no: 212, name: "SHAYAN", team_id: "team-b", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-213", chest_no: 213, name: "MUHSIN", team_id: "team-b", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-214", chest_no: 214, name: "AFNAN", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-215", chest_no: 215, name: "HISHAM H2", team_id: "team-b", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-216", chest_no: 216, name: "MIJWAD", team_id: "team-b", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-217", chest_no: 217, name: "ANAS", team_id: "team-b", grade: "D", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-218", chest_no: 218, name: "HISHAM H1", team_id: "team-b", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },

  // GROUP C (Chest 300 - 318)
  { id: "stud-300", chest_no: 300, name: "SALIH KK (L)", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-301", chest_no: 301, name: "ASLAH (AL)", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-302", chest_no: 302, name: "JAVAD D2", team_id: "team-c", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-303", chest_no: 303, name: "MUFEED", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-304", chest_no: 304, name: "SUFIYAN VS", team_id: "team-c", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-305", chest_no: 305, name: "AMEEN D2", team_id: "team-c", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-306", chest_no: 306, name: "FASIL", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-307", chest_no: 307, name: "SHAHEEM", team_id: "team-c", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-308", chest_no: 308, name: "SHAMIL", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-309", chest_no: 309, name: "SAFVAN", team_id: "team-c", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-310", chest_no: 310, name: "SHABAB", team_id: "team-c", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-311", chest_no: 311, name: "SHIBILI", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-312", chest_no: 312, name: "FADHIL", team_id: "team-c", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-313", chest_no: 313, name: "ANSIL", team_id: "team-c", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-314", chest_no: 314, name: "HADI", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-315", chest_no: 315, name: "HAMDAN", team_id: "team-c", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-316", chest_no: 316, name: "ALTHAF", team_id: "team-c", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-317", chest_no: 317, name: "SINAN", team_id: "team-c", grade: "D", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-318", chest_no: 318, name: "ASLAM", team_id: "team-c", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },

  // GROUP D (Chest 400 - 418)
  { id: "stud-400", chest_no: 400, name: "ZAMAN (L)", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-401", chest_no: 401, name: "SUFYAN KK (AL)", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-402", chest_no: 402, name: "HUWAIS", team_id: "team-d", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-403", chest_no: 403, name: "NAFIH", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-404", chest_no: 404, name: "SHAHINSHA", team_id: "team-d", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-405", chest_no: 405, name: "ARSHAD", team_id: "team-d", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-406", chest_no: 406, name: "SWALIH M", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-407", chest_no: 407, name: "SAHVAN", team_id: "team-d", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-408", chest_no: 408, name: "RAZZAN", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-409", chest_no: 409, name: "SINAN VP", team_id: "team-d", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-410", chest_no: 410, name: "RASHID", team_id: "team-d", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-411", chest_no: 411, name: "SHAMVEEL", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-412", chest_no: 412, name: "SHABEEN", team_id: "team-d", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-413", chest_no: 413, name: "MUSLIH H2", team_id: "team-d", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-414", chest_no: 414, name: "RABEEH", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-415", chest_no: 415, name: "SABITH", team_id: "team-d", grade: "B", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-416", chest_no: 416, name: "HASHIR", team_id: "team-d", grade: "C", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-417", chest_no: 417, name: "JASEEL", team_id: "team-d", grade: "D", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
  { id: "stud-418", chest_no: 418, name: "RAZI", team_id: "team-d", grade: "A", photo_url: UNKNOWN_PERSON_AVATAR, total_points: 0 },
];

export const INITIAL_PROGRAMS: Program[] = [
  // ── GENERAL PROGRAMMES (6) ──
  { id: "gen-1", name: "Burdha", category: "General", grade: "General", is_revealed: false, points_1st: 25, points_2nd: 15, points_3rd: 10 },
  { id: "gen-2", name: "Bhakthigeet", category: "General", grade: "General", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "gen-3", name: "Musha'ara", category: "General", grade: "General", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "gen-4", name: "Quiz", category: "General", grade: "General", is_revealed: false, points_1st: 20, points_2nd: 15, points_3rd: 10 },
  { id: "gen-5", name: "Spelling bee English", category: "General", grade: "General", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "gen-6", name: "Magazine", category: "General", grade: "General", is_revealed: false, points_1st: 25, points_2nd: 15, points_3rd: 10 },

  // ── SANAVIYYA - ON STAGE (17) ──
  { id: "san-on-1", name: "Thilava (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-2", name: "Hifz (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-3", name: "Mappilapattu (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-4", name: "Song Malayalam (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-5", name: "Song Arabic (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-6", name: "Speech Malayalam (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-7", name: "Speech Arabic (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-8", name: "Speech English (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-9", name: "Speech Urdu (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-10", name: "Spiritual talk (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-11", name: "Wordfight Arabic (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-12", name: "Wordfight English (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-13", name: "News reading English (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-14", name: "Ma'ala (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-15", name: "Sweet Malayalam (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-16", name: "Hivar Arabic (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-on-17", name: "Thasreef (Sanaviyya)", category: "Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },

  // ── SANAVIYYA - OFF STAGE (23) ──
  { id: "san-off-18", name: "Essay Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-19", name: "Essay English (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-20", name: "Essay Arabic (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-21", name: "Story writing Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-22", name: "Story writing English (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-23", name: "Story writing Arabic (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-24", name: "Book review Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-25", name: "Calligraphy (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-26", name: "Digital poster designing (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-27", name: "Dictionary making Arabic to Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-28", name: "Poem writing Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-29", name: "Poem writing English (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-30", name: "Poem writing Arabic (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-31", name: "Poem writing Urdu (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-32", name: "Listening Arabic (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-33", name: "Translation Arabic to Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-34", name: "Khathu Arabic (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-35", name: "Smart test (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-36", name: "Pencil drawing (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-37", name: "Short story Urdu (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-38", name: "Typing Malayalam (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-39", name: "Typing Arabic (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "san-off-40", name: "Typing English (Sanaviyya)", category: "Off-Stage", grade: "Sanaviyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },

  // ── BAKALOORIYYA - ON STAGE (24) ──
  { id: "bak-on-1", name: "Thilava (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-2", name: "Mappilapattu (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-3", name: "Song Malayalam (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-4", name: "Song Arabic (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-5", name: "Speech Malayalam (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-6", name: "Speech Arabic (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-7", name: "Speech English (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-8", name: "Speech Urdu (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-9", name: "Spiritual talk (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-10", name: "Wordfight Arabic (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-11", name: "Wordfight English (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-12", name: "News reading Arabic (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-13", name: "Kuthuba (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-14", name: "Thadrees (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-15", name: "Playback vocal Arabic (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-16", name: "Situation management interview (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-17", name: "Debate English (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-18", name: "Sport translation Arabic to Malayalam (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-19", name: "Allafal alif (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-20", name: "Think talk Malayalam (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-21", name: "Phone A foreigner (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-22", name: "Farahiz Test (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-23", name: "Turn the table (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-on-24", name: "History talk (Bakalooriyya)", category: "Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },

  // ── BAKALOORIYYA - OFF STAGE (27) ──
  { id: "bak-off-1", name: "Essay Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-2", name: "Essay English (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-3", name: "Essay Arabic (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-4", name: "Story writing Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-5", name: "Story writing English (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-6", name: "Story writing Arabic (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-7", name: "Book review Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-8", name: "Calligraphy (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-9", name: "Digital poster designing (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-10", name: "Dictionary making Arabic to Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-11", name: "Poem writing Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-12", name: "Poem writing English (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-13", name: "Poem writing Arabic (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-14", name: "Poem writing Urdu (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-15", name: "Listening Arabic (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-16", name: "Translation Arb to Eng (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-17", name: "Literary translation (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-18", name: "Interviewing (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-19", name: "Painting (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-20", name: "Mathematical reasoning and aptitude (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-21", name: "Syllogism (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-22", name: "Essay Urdu (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-23", name: "Documentary script writing (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-24", name: "Song writing Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-25", name: "Nano literature English (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-26", name: "Typing Malayalam (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-27", name: "Typing Arabic (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
  { id: "bak-off-28", name: "Typing English (Bakalooriyya)", category: "Off-Stage", grade: "Bakalooriyya", is_revealed: false, points_1st: 15, points_2nd: 10, points_3rd: 5 },
];

export const INITIAL_RESULTS: Result[] = [];

export const SUPABASE_SQL_SCHEMA = `
-- Create Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  logo_url TEXT,
  total_score INTEGER DEFAULT 0
);

-- Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  chest_no INTEGER,
  name TEXT NOT NULL,
  team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
  grade TEXT DEFAULT 'A',
  photo_url TEXT,
  total_points INTEGER DEFAULT 0
);

-- Create Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  grade TEXT DEFAULT 'A',
  is_revealed BOOLEAN DEFAULT false,
  points_1st INTEGER DEFAULT 15,
  points_2nd INTEGER DEFAULT 10,
  points_3rd INTEGER DEFAULT 5
);

-- Create Results Table
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  position INTEGER,
  grade TEXT,
  points_awarded INTEGER NOT NULL,
  remarks TEXT
);

-- Enable RLS & Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON students FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON programs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON results FOR SELECT USING (true);

-- Allow All Access for Admin
CREATE POLICY "Admin Full Access" ON teams FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON students FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON programs FOR ALL USING (true);
CREATE POLICY "Admin Full Access" ON results FOR ALL USING (true);
`;

export const INITIAL_SLIDESHOW_IMAGES = [
  {
    id: "slide-1",
    image_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Elegance & Grace",
    subtitle: "High Fashion Editorial & Lumina Alabaster Theme",
    category: "Stage",
    aspect_ratio: "portrait", // 3/4
  },
  {
    id: "slide-2",
    image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Minimal Form & Sculpture",
    subtitle: "Ceramic Textures & Sculptural Forms",
    category: "Off-Stage",
    aspect_ratio: "square", // 1/1
  },
  {
    id: "slide-3",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Airy Interior Architecture",
    subtitle: "Natural Light & Polished Concrete Space",
    category: "General",
    aspect_ratio: "vertical", // 4/5
  },
  {
    id: "slide-4",
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Pure Skincare Essentials",
    subtitle: "Pristine Minimalist Product Flatlay",
    category: "Highlights",
    aspect_ratio: "square", // 1/1
  },
  {
    id: "slide-5",
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Abstract Waves & Curves",
    subtitle: "Subtle Gradients & Fine Art Grain",
    category: "Off-Stage",
    aspect_ratio: "square", // 1/1
  },
  {
    id: "slide-6",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-ce74f45814d0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Serene Coastline Dawn",
    subtitle: "Tranquil Horizons & High-Key Lighting",
    category: "Stage",
    aspect_ratio: "tall", // 9/16
  },
  {
    id: "slide-7",
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Linen Drapes & Soft Folds",
    subtitle: "Tactile Luxury Materials & Warm Shadows",
    category: "General",
    aspect_ratio: "square", // 1/1
  },
  {
    id: "slide-8",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Geometric Still Life",
    subtitle: "Interplay of Light & Minimalist Geometry",
    category: "Highlights",
    aspect_ratio: "portrait", // 3/4
  },
  {
    id: "slide-9",
    image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Solitary Botanical Bloom",
    subtitle: "Simple Delicate Petals & Ceramic Vase",
    category: "General",
    aspect_ratio: "square", // 1/1
  },
  {
    id: "slide-10",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    ],
    title: "Architectural Spiral Curve",
    subtitle: "Uncluttered Curves & Diffused Skylight",
    category: "Stage",
    aspect_ratio: "vertical", // 4/5
  },
];
