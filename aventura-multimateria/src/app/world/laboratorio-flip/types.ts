// Tipos para el minijuego Laboratorio Flip-Ciencia

export interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  canal: string;
  duracion: string;
  descripcion: string;
}

export interface FlipLesson {
  id: string;
  title: string;
  videoUrl?: string; // Mantener para compatibilidad hacia atrás
  videos?: Video[]; // Nueva estructura con múltiples videos
  captions: string;
  questions: Question[];
  thumbnail: string;
}

export interface ExperimentPiece {
  id: string;
  name: string;
  icon: string;
  obtained: boolean;
}

export interface GameState {
  currentLesson: number;
  answers: (number | null)[];
  completedLessons: number;
  piecesObtained: number;
  xp: number;
  lessons: FlipLesson[];
  experimentPieces: ExperimentPiece[];
  feedback: {
    show: boolean;
    success: boolean;
    message: string;
    explanation?: string;
  } | null;
  gameStatus: "instructions" | "playing" | "video" | "quiz" | "completed" | "retrying";
  badge: boolean;
  showInstructions: boolean;
  videoWatched: boolean;
  quizStarted: boolean;
}

export interface Badge {
  id: string;
  name: string;
}

// Constantes del juego
export const EXPERIMENT_PIECES: ExperimentPiece[] = [
  {
    id: "beaker",
    name: "Vaso de precipitados",
    icon: "🧪",
    obtained: false,
  },
  {
    id: "reactivo1",
    name: "Reactivo A",
    icon: "🟦",
    obtained: false,
  },
  {
    id: "reactivo2",
    name: "Reactivo B",
    icon: "🟨",
    obtained: false,
  },
  {
    id: "flame",
    name: "Mechero Bunsen",
    icon: "🔥",
    obtained: false,
  },
];

export const SCIENTIST_BADGE: Badge = {
  id: "cientifico_novato",
  name: "Científico Novato",
};