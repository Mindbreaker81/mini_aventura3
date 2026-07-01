import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReciclajeItem } from './types';
import { RECICLAJE_WIN_TARGET } from './types';
import type { GameStatus } from '../shared/types';
import { selectRandom } from '../shared/random';
import { ITEMS_POOL_ID } from './dragdrop-utils';

export interface FabricaReciclajeState {
  allItems: ReciclajeItem[];
  roundItems: ReciclajeItem[];
  assigned: Record<string, string>;
  correctIds: string[];
  sorted: number;
  feedback: { itemId: string; correct: boolean; rule: string } | null;
  xp: number;
  badge: boolean;
  gameStatus: GameStatus;
  showInstructions: boolean;
  loadItems: (all: ReciclajeItem[]) => void;
  assignItem: (itemId: string, bin: string) => void;
  unassignItem: (itemId: string) => void;
  hideFeedback: () => void;
  resetGame: () => void;
  startGame: () => void;
}

const freshRoundState = (roundItems: ReciclajeItem[]) => ({
  roundItems,
  assigned: {} as Record<string, string>,
  correctIds: [] as string[],
  sorted: 0,
  feedback: null,
  xp: 0,
  badge: false,
  gameStatus: 'instructions' as GameStatus,
  showInstructions: true,
});

export const useFabricaReciclajeStore = create<FabricaReciclajeState>()(
  persist(
    (set, get) => ({
      allItems: [],
      roundItems: [],
      assigned: {},
      correctIds: [],
      sorted: 0,
      feedback: null,
      xp: 0,
      badge: false,
      gameStatus: 'instructions',
      showInstructions: true,

      loadItems: (all: ReciclajeItem[]) => {
        const unique = all.filter(
          (item, index, self) => index === self.findIndex((i) => i.id === item.id)
        );
        const roundItems = selectRandom(unique, Math.min(RECICLAJE_WIN_TARGET, unique.length));
        set({
          allItems: unique,
          ...freshRoundState(roundItems),
        });
      },

      assignItem: (itemId: string, bin: string) => {
        const state = get();
        if (state.gameStatus === 'completed') return;

        const entry = state.roundItems.find((i) => i.id === itemId);
        if (!entry) return;

        if (bin === ITEMS_POOL_ID) {
          get().unassignItem(itemId);
          return;
        }

        const correct = entry.bin === bin;
        const alreadyCorrect = state.correctIds.includes(itemId);

        if (correct) {
          if (!alreadyCorrect) {
            const newSorted = state.sorted + 1;
            const completed = newSorted >= RECICLAJE_WIN_TARGET;
            set({
              assigned: { ...state.assigned, [itemId]: bin },
              correctIds: [...state.correctIds, itemId],
              sorted: newSorted,
              xp: state.xp + 10,
              feedback: { itemId, correct: true, rule: entry.rule },
              gameStatus: completed ? 'completed' : 'playing',
              badge: completed,
            });
          } else {
            set({
              assigned: { ...state.assigned, [itemId]: bin },
              feedback: { itemId, correct: true, rule: entry.rule },
            });
          }
          return;
        }

        set({
          feedback: { itemId, correct: false, rule: entry.rule },
        });
      },

      unassignItem: (itemId: string) => {
        const state = get();
        const wasCorrect = state.correctIds.includes(itemId);
        const newAssigned = { ...state.assigned };
        delete newAssigned[itemId];

        set({
          assigned: newAssigned,
          correctIds: state.correctIds.filter((id) => id !== itemId),
          sorted: wasCorrect ? Math.max(0, state.sorted - 1) : state.sorted,
          xp: wasCorrect ? Math.max(0, state.xp - 10) : state.xp,
          badge: false,
          gameStatus: state.gameStatus === 'completed' ? 'playing' : state.gameStatus,
          feedback: null,
        });
      },

      hideFeedback: () => set({ feedback: null }),

      resetGame: () => {
        const { allItems } = get();
        if (allItems.length === 0) return;
        set(
          freshRoundState(
            selectRandom(allItems, Math.min(RECICLAJE_WIN_TARGET, allItems.length))
          )
        );
      },

      startGame: () => {
        set({ showInstructions: false, gameStatus: 'playing' });
      },
    }),
    {
      name: 'fabrica-reciclaje-storage',
      partialize: (state) => ({
        allItems: state.allItems,
        roundItems: state.roundItems,
        assigned: state.assigned,
        correctIds: state.correctIds,
        sorted: state.sorted,
        xp: state.xp,
        badge: state.badge,
        gameStatus: state.gameStatus,
        showInstructions: state.showInstructions,
      }),
    }
  )
);

export { ITEMS_POOL_ID };
