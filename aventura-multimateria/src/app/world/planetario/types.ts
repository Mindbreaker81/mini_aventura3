import type { GameStatus } from '../shared/types';

export type GameMode = 'planetas' | 'exploracion';

export interface CelestialBody {
  id: string;
  name: string;
  order: number;
  fact: string;
  emoji?: string;
  type?: 'planet' | 'milestone';
}

export const INITIAL_LIVES = 3;
export const XP_PER_CORRECT_ROUND = 10;
export const XP_COMPLETION_BONUS = 80;

export const POOL_DROPPABLE_ID = 'planetario-pool';

export const MODE_CONFIG = {
  planetas: {
    roundSize: 8,
    poolFilter: 'planet' as const,
    xpPerCorrect: XP_PER_CORRECT_ROUND,
    completionBonus: XP_COMPLETION_BONUS,
  },
  exploracion: {
    roundSize: 8,
    poolFilter: 'milestone' as const,
    xpPerCorrect: XP_PER_CORRECT_ROUND,
    completionBonus: XP_COMPLETION_BONUS,
  },
} as const;

export interface PlanetarioState {
  mode: GameMode;
  roundSize: number;
  allBodies: CelestialBody[];
  roundBodies: CelestialBody[];
  correctOrder: string[];
  timeline: (string | null)[];
  lives: number;
  xp: number;
  badge: boolean;
  gameStatus: GameStatus;
  showInstructions: boolean;
  feedback: { correct: boolean; message: string } | null;
}

/** @deprecated Use MODE_CONFIG[mode].roundSize */
export const ROUND_SIZE = MODE_CONFIG.planetas.roundSize;
