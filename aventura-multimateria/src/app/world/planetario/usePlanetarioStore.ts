import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStatus } from '../shared/types';
import { selectRandom } from '../shared/random';
import {
  CelestialBody,
  GameMode,
  MODE_CONFIG,
  INITIAL_LIVES,
} from './types';

interface PlanetarioStore {
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

  loadBodies: (mode: GameMode, bodies: CelestialBody[]) => void;
  startGame: () => void;
  moveToSlot: (bodyId: string, slotIndex: number) => void;
  moveToPool: (bodyId: string) => void;
  submitTimeline: () => void;
  hideFeedback: () => void;
  resetGame: () => void;
}

function modePool(mode: GameMode, bodies: CelestialBody[]): CelestialBody[] {
  const filter = MODE_CONFIG[mode].poolFilter;
  return bodies.filter((b) => b.type === filter);
}

function buildRound(mode: GameMode, bodies: CelestialBody[]) {
  const config = MODE_CONFIG[mode];
  const pool = modePool(mode, bodies);
  const source = pool.length >= config.roundSize ? pool : pool;
  const roundBodies = selectRandom(source, Math.min(config.roundSize, source.length)).sort(
    (a, b) => a.order - b.order
  );
  return {
    mode,
    roundSize: config.roundSize,
    roundBodies,
    correctOrder: roundBodies.map((b) => b.id),
    timeline: Array<string | null>(config.roundSize).fill(null),
    lives: INITIAL_LIVES,
    xp: 0,
    badge: false,
    gameStatus: 'playing' as GameStatus,
    feedback: null,
  };
}

export const usePlanetarioStore = create<PlanetarioStore>()(
  persist(
    (set, get) => ({
      mode: 'planetas',
      roundSize: MODE_CONFIG.planetas.roundSize,
      allBodies: [],
      roundBodies: [],
      correctOrder: [],
      timeline: Array(MODE_CONFIG.planetas.roundSize).fill(null),
      lives: INITIAL_LIVES,
      xp: 0,
      badge: false,
      gameStatus: 'instructions',
      showInstructions: true,
      feedback: null,

      loadBodies: (mode, bodies) => {
        set({
          allBodies: bodies,
          ...buildRound(mode, bodies),
          showInstructions: true,
          gameStatus: 'instructions',
        });
      },

      startGame: () => {
        set({ showInstructions: false, gameStatus: 'playing' });
      },

      moveToSlot: (bodyId, slotIndex) => {
        if (get().gameStatus !== 'playing') return;

        set((state) => {
          const timeline = [...state.timeline];
          const fromIndex = timeline.indexOf(bodyId);
          if (fromIndex !== -1) timeline[fromIndex] = null;
          const displaced = timeline[slotIndex];
          if (displaced && displaced !== bodyId) {
            timeline[timeline.indexOf(displaced)] = null;
          }
          timeline[slotIndex] = bodyId;
          return { timeline, feedback: null };
        });
      },

      moveToPool: (bodyId) => {
        set((state) => {
          const timeline = state.timeline.map((id) => (id === bodyId ? null : id));
          return { timeline };
        });
      },

      submitTimeline: () => {
        const { timeline, correctOrder, lives, xp, roundSize, mode } = get();
        const config = MODE_CONFIG[mode];

        if (timeline.some((id) => id === null)) {
          set({
            feedback: {
              correct: false,
              message: 'planetario.feedback.incomplete',
            },
          });
          return;
        }

        const isCorrect = timeline.every((id, index) => id === correctOrder[index]);

        if (isCorrect) {
          set({
            gameStatus: 'completed',
            badge: true,
            xp: xp + config.xpPerCorrect * roundSize + config.completionBonus,
            feedback: {
              correct: true,
              message: 'planetario.feedback.completed',
            },
          });
          return;
        }

        const newLives = lives - 1;
        if (newLives <= 0) {
          set({
            lives: 0,
            gameStatus: 'failed',
            feedback: {
              correct: false,
              message: 'planetario.feedback.failed',
            },
          });
        } else {
          set({
            lives: newLives,
            feedback: {
              correct: false,
              message: 'planetario.feedback.wrongOrder',
            },
          });
        }
      },

      hideFeedback: () => set({ feedback: null }),

      resetGame: () => {
        const { allBodies, mode } = get();
        if (allBodies.length === 0) return;
        set({
          ...buildRound(mode, allBodies),
          showInstructions: true,
          gameStatus: 'instructions',
        });
      },
    }),
    {
      name: 'planetario-storage',
      partialize: (state) => ({
        mode: state.mode,
        roundSize: state.roundSize,
        allBodies: state.allBodies,
        roundBodies: state.roundBodies,
        correctOrder: state.correctOrder,
        timeline: state.timeline,
        lives: state.lives,
        xp: state.xp,
        badge: state.badge,
        gameStatus: state.gameStatus,
        showInstructions: state.showInstructions,
      }),
    }
  )
);

export function getPoolBodyIds(
  roundBodies: CelestialBody[],
  timeline: (string | null)[]
): string[] {
  const placed = new Set(timeline.filter(Boolean) as string[]);
  return roundBodies.filter((b) => !placed.has(b.id)).map((b) => b.id);
}

export function formatOrder(order: number): string {
  return `#${order}`;
}

export type { CelestialBody, GameMode };
