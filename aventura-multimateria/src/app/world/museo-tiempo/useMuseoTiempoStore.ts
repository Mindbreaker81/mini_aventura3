import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStatus } from '../shared/types';
import { selectRandom } from '../shared/random';
import {
  HistoricalEvent,
  ROUND_SIZE,
  INITIAL_LIVES,
  XP_PER_CORRECT_ROUND,
  XP_COMPLETION_BONUS,
} from './types';

interface MuseoTiempoStore {
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

  loadEvents: (events: HistoricalEvent[]) => void;
  startGame: () => void;
  moveToSlot: (eventId: string, slotIndex: number) => void;
  moveToPool: (eventId: string) => void;
  submitTimeline: () => void;
  hideFeedback: () => void;
  resetGame: () => void;
}

function buildRound(events: HistoricalEvent[]) {
  const roundEvents = selectRandom(events, ROUND_SIZE).sort((a, b) => a.year - b.year);
  return {
    roundEvents,
    correctOrder: roundEvents.map((e) => e.id),
    timeline: Array<string | null>(ROUND_SIZE).fill(null),
    lives: INITIAL_LIVES,
    xp: 0,
    badge: false,
    gameStatus: 'playing' as GameStatus,
    feedback: null,
  };
}

export const useMuseoTiempoStore = create<MuseoTiempoStore>()(
  persist(
    (set, get) => ({
      allEvents: [],
      roundEvents: [],
      correctOrder: [],
      timeline: Array(ROUND_SIZE).fill(null),
      lives: INITIAL_LIVES,
      xp: 0,
      badge: false,
      gameStatus: 'instructions',
      showInstructions: true,
      feedback: null,

      loadEvents: (events) => {
        set({
          allEvents: events,
          ...buildRound(events),
          showInstructions: true,
          gameStatus: 'instructions',
        });
      },

      startGame: () => {
        set({ showInstructions: false, gameStatus: 'playing' });
      },

      moveToSlot: (eventId, slotIndex) => {
        if (get().gameStatus !== 'playing') return;

        set((state) => {
          const timeline = [...state.timeline];
          const fromIndex = timeline.indexOf(eventId);
          if (fromIndex !== -1) timeline[fromIndex] = null;
          const displaced = timeline[slotIndex];
          if (displaced && displaced !== eventId) {
            timeline[timeline.indexOf(displaced)] = null;
          }
          timeline[slotIndex] = eventId;
          return { timeline, feedback: null };
        });
      },

      moveToPool: (eventId) => {
        set((state) => {
          const timeline = state.timeline.map((id) => (id === eventId ? null : id));
          return { timeline };
        });
      },

      submitTimeline: () => {
        const { timeline, correctOrder, lives, xp } = get();

        if (timeline.some((id) => id === null)) {
          set({
            feedback: {
              correct: false,
              message: 'museo.feedback.incomplete',
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
              message: 'museo.feedback.completed',
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
              message: 'museo.feedback.failed',
            },
          });
        } else {
          set({
            lives: newLives,
            feedback: {
              correct: false,
              message: 'museo.feedback.wrongOrder',
            },
          });
        }
      },

      hideFeedback: () => set({ feedback: null }),

      resetGame: () => {
        const { allEvents } = get();
        if (allEvents.length === 0) return;
        set({
          ...buildRound(allEvents),
          showInstructions: true,
          gameStatus: 'instructions',
        });
      },
    }),
    {
      name: 'museo-tiempo-storage',
      partialize: (state) => ({
        allEvents: state.allEvents,
        roundEvents: state.roundEvents,
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

export function getPoolEventIds(
  roundEvents: HistoricalEvent[],
  timeline: (string | null)[]
): string[] {
  const placed = new Set(timeline.filter(Boolean) as string[]);
  return roundEvents.filter((e) => !placed.has(e.id)).map((e) => e.id);
}

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} a.C.`;
  return `${year}`;
}
