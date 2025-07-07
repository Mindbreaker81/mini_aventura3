// Tipos para el minijuego Misión Mapamundi v2

export type GameMode = "continent" | "ocean" | "ccaa";

export interface MapamundiTask {
  id: number;
  mode: GameMode;
  question: string;
  targetId: string;
  explanation: string;
}

export interface GameState {
  // Estado de la partida
  currentTask: number;
  lives: number;
  completedStamps: number;
  tasks: MapamundiTask[];
  selectedRegion: string | null;
  
  // Estado de la UI
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'success' | 'error';
  gameStatus: 'playing' | 'completed' | 'gameOver';
  
  // Configuración
  mode: GameMode;
  maxQuestions: number;
}

export interface GameActions {
  // Acciones del juego
  initializeGame: (mode: GameMode) => void;
  selectRegion: (regionId: string) => void;
  submitAnswer: () => void;
  nextTask: () => void;
  resetGame: () => void;
  
  // Acciones de UI
  showFeedback: (type: 'success' | 'error', message: string) => void;
  hideFeedback: () => void;
  
  // XP y recompensas
  gainXP: (amount: number) => void;
  completeWorld: () => void;
}

export interface MapGameProps {
  mode: GameMode;
}

export interface MapComponentProps {
  task: MapamundiTask;
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  onResult: (result: { correct: boolean; message: string }) => void;
}

export interface PassportProps {
  completedStamps: number;
  totalStamps: number;
  mode: GameMode;
}

// Configuración por modo
export const MODE_CONFIG = {
  continent: {
    maxQuestions: 7,
    badge: { id: "globetrotter_cont", name: "Explorador de Continentes" },
    xpPerCorrect: 12,
    bonusXP: 100
  },
  ocean: {
    maxQuestions: 5,
    badge: { id: "globetrotter_ocean", name: "Explorador de Océanos" },
    xpPerCorrect: 12,
    bonusXP: 100
  },
  ccaa: {
    maxQuestions: 10,
    badge: { id: "globetrotter_ccaa", name: "Explorador de España" },
    xpPerCorrect: 12,
    bonusXP: 100
  }
} as const; 