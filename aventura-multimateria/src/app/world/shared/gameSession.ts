import type { GameStatus } from './types';

/** Estado mínimo consultable para decidir si hay partida en curso */
export interface SessionCheckable {
  gameStatus?: GameStatus | 'gameOver' | 'video' | 'quiz' | 'retrying';
  showInstructions?: boolean;
  repaired?: number;
  currentTask?: number;
  completedStamps?: number;
  tasks?: unknown[];
  lessons?: unknown[];
  roundWords?: unknown[];
  gameCompleted?: boolean;
  completed?: boolean;
  energy?: number;
  currentPassage?: number;
  mode?: string;
}

/**
 * Devuelve true si existe una sesión que no debe ser sobrescrita al montar la página.
 */
export function hasActiveSession(state: SessionCheckable): boolean {
  const status = state.gameStatus;

  if (
    status === 'completed' ||
    status === 'failed' ||
    status === 'gameOver' ||
    status === 'video' ||
    status === 'quiz' ||
    status === 'retrying'
  ) {
    return true;
  }

  if (status === 'playing') {
    if ((state.tasks?.length ?? 0) > 0) return true;
    if ((state.lessons?.length ?? 0) > 0) return true;
    if ((state.roundWords?.length ?? 0) > 0 && state.showInstructions === false) return true;
  }

  if (state.gameCompleted || state.completed) {
    return true;
  }

  if ((state.repaired ?? 0) > 0) return true;
  if ((state.currentTask ?? 0) > 0) return true;
  if ((state.completedStamps ?? 0) > 0) return true;
  if ((state.currentPassage ?? 0) > 0) return true;
  if ((state.energy ?? 5) < 5) return true;
  if ((state.tasks?.length ?? 0) > 0 && status !== 'instructions') return true;
  if ((state.lessons?.length ?? 0) > 0) return true;
  if ((state.roundWords?.length ?? 0) > 0 && state.showInstructions === false) return true;

  return false;
}

/** Sesión activa para Mapamundi: el modo debe coincidir */
export function hasActiveSessionForMode(
  state: SessionCheckable,
  mode: string
): boolean {
  if (state.mode !== mode) return false;
  return hasActiveSession(state);
}
