import type { GameStatus } from '../shared/types';

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;
  description: string;
}

export const ROUND_SIZE = 8;
export const INITIAL_LIVES = 3;
export const XP_PER_CORRECT_ROUND = 10;
export const XP_COMPLETION_BONUS = 80;

export interface MuseoTiempoState {
  allEvents: HistoricalEvent[];
  roundEvents: HistoricalEvent[];
  correctOrder: string[];
  timeline: (string | null)[];
  lives: number;
  xp: number;
  badge: boolean;
  gameStatus: GameStatus;
  showInstructions: boolean;
  feedback: { correct: boolean; message: string } | null;
}

export const POOL_DROPPABLE_ID = 'museo-pool';
