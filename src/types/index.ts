export interface Team {
  id: string;
  name: string;
  color: string; // Hex color or Tailwind accent color
  logo_url?: string;
  total_score: number;
}

export interface Student {
  id: string;
  name: string;
  chest_no?: number;
  team_id: string;
  grade?: "A" | "B" | "C" | "D" | string;
  photo_url?: string;
  total_points: number;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  grade?: "A" | "B" | "C" | "D" | string;
  is_revealed: boolean;
  points_1st: number;
  points_2nd: number;
  points_3rd: number;
  points_A?: number;
  points_B?: number;
  points_C?: number;
  points_D?: number;
  updated_at?: string;
}

export interface Result {
  id: string;
  program_id: string;
  student_id: string;
  team_id?: string | null;
  position?: 1 | 2 | 3 | null;
  grade?: "A" | "B" | "C" | "D" | "No Grade" | string | null;
  points_awarded: number;
  remarks?: string;
  created_at?: string;
}

export interface ScoreProgressionPoint {
  program: string;
  [teamName: string]: number | string;
}

