import type { GameStatus } from '../shared/types';

export interface CelestialBody {
  id: string;
  name: string;
  order: number;
  fact: string;
  emoji?: string;
  type?: 'planet' | 'milestone';
}

export const ROUND_SIZE = 8;
export const INITIAL_LIVES = 3;
export const XP_PER_CORRECT_ROUND = 10;
export const XP_COMPLETION_BONUS = 80;

export const POOL_DROPPABLE_ID = 'planetario-pool';

export interface PlanetarioState {
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
