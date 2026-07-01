import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStatus } from '../shared/types';
import { selectRandom } from '../shared/random';
import {
  CelestialBody,
  ROUND_SIZE,
  INITIAL_LIVES,
  XP_PER_CORRECT_ROUND,
  XP_COMPLETION_BONUS,
} from './types';

interface PlanetarioStore {
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

  loadBodies: (bodies: CelestialBody[]) => void;
  startGame: () => void;
  moveToSlot: (bodyId: string, slotIndex: number) => void;
  moveToPool: (bodyId: string) => void;
  submitTimeline: () => void;
  hideFeedback: () => void;
  resetGame: () => void;
}

function planetPool(bodies: CelestialBody[]): CelestialBody[] {
  return bodies.filter((b) => b.type !== 'milestone');
}

function buildRound(bodies: CelestialBody[]) {
  const pool = planetPool(bodies);
  const source = pool.length >= ROUND_SIZE ? pool : bodies;
  const roundBodies = selectRandom(source, ROUND_SIZE).sort((a, b) => a.order - b.order);
  return {
    roundBodies,
    correctOrder: roundBodies.map((b) => b.id),
    timeline: Array<string | null>(ROUND_SIZE).fill(null),
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
      allBodies: [],
      roundBodies: [],
      correctOrder: [],
      timeline: Array(ROUND_SIZE).fill(null),
      lives: INITIAL_LIVES,
      xp: 0,
      badge: false,
      gameStatus: 'instructions',
      showInstructions: true,
      feedback: null,

      loadBodies: (bodies) => {
        set({
          allBodies: bodies,
          ...buildRound(bodies),
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
        const { timeline, correctOrder, lives, xp } = get();

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
            xp: xp + XP_PER_CORRECT_ROUND * ROUND_SIZE + XP_COMPLETION_BONUS,
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
        const { allBodies } = get();
        if (allBodies.length === 0) return;
        set({
          ...buildRound(allBodies),
          showInstructions: true,
          gameStatus: 'instructions',
        });
      },
    }),
    {
      name: 'planetario-storage',
      partialize: (state) => ({
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

export type { CelestialBody };
