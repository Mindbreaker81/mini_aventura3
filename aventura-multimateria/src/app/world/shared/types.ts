/** Estados de partida unificados entre minijuegos */
export type GameStatus =
  | 'instructions'
  | 'playing'
  | 'completed'
  | 'failed';

/** Feedback modal genérico */
export interface GameFeedback {
  show: boolean;
  correct: boolean;
  message: string;
  explanation?: string;
}

/** Campos mínimos que todo store de juego debe exponer */
export interface BaseGameState {
  xp: number;
  badge: boolean;
  gameStatus: GameStatus;
  showInstructions: boolean;
  feedback: GameFeedback | null;
}

/** Acciones mínimas comunes */
export interface BaseGameActions {
  startGame: () => void;
  showFeedback: (correct: boolean, message: string, explanation?: string) => void;
  hideFeedback: () => void;
  resetGame: () => void;
}

export const WIN_REPAIRED_TARGET = 6;
