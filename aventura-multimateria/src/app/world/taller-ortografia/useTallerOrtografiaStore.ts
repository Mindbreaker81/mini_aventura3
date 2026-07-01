import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStatus } from '../shared/types';
import { selectRandom } from '../shared/random';
import type { OrtografiaItem } from './types';
import { ORTOGRAFIA_INITIAL_HEARTS, ORTOGRAFIA_ROUND_SIZE } from './types';

interface TallerOrtografiaState {
  allItems: OrtografiaItem[];
  roundItems: OrtografiaItem[];
  currentIndex: number;
  hearts: number;
  xp: number;
  badge: boolean;
  gameStatus: GameStatus;
  showInstructions: boolean;
  loadItems: (all: OrtografiaItem[]) => void;
  startGame: () => void;
  answerQuestion: (selectedIndex: number) => { correct: boolean; rule: string };
  nextQuestion: () => void;
  resetGame: () => void;
}

const freshProgress = (roundItems: OrtografiaItem[]) => ({
  roundItems,
  currentIndex: 0,
  hearts: ORTOGRAFIA_INITIAL_HEARTS,
  xp: 0,
  badge: false,
  gameStatus: 'instructions' as GameStatus,
  showInstructions: true,
});

export const useTallerOrtografiaStore = create<TallerOrtografiaState>()(
  persist(
    (set, get) => ({
      allItems: [],
      roundItems: [],
      currentIndex: 0,
      hearts: ORTOGRAFIA_INITIAL_HEARTS,
      xp: 0,
      badge: false,
      gameStatus: 'instructions',
      showInstructions: true,

      loadItems: (all) => {
        const unique = all.filter(
          (item, index, self) => index === self.findIndex((i) => i.id === item.id)
        );
        const roundItems = selectRandom(unique, Math.min(ORTOGRAFIA_ROUND_SIZE, unique.length));
        set({
          allItems: unique,
          ...freshProgress(roundItems),
        });
      },

      startGame: () => {
        set({ showInstructions: false, gameStatus: 'playing' });
      },

      answerQuestion: (selectedIndex) => {
        const { roundItems, currentIndex, hearts, xp, gameStatus } = get();
        if (gameStatus !== 'playing') {
          return { correct: false, rule: '' };
        }

        const item = roundItems[currentIndex];
        if (!item) return { correct: false, rule: '' };

        const correct = item.answer === selectedIndex;
        if (correct) {
          set({ xp: xp + 10 });
        } else {
          const newHearts = Math.max(0, hearts - 1);
          set({
            hearts: newHearts,
            gameStatus: newHearts === 0 ? 'failed' : gameStatus,
          });
        }

        return { correct, rule: item.rule };
      },

      nextQuestion: () => {
        const { currentIndex, roundItems, hearts } = get();
        if (hearts === 0) return;

        const isLast = currentIndex >= roundItems.length - 1;
        if (isLast) {
          set({
            gameStatus: 'completed',
            badge: hearts > 0,
            xp: get().xp + (hearts > 0 ? 40 : 0),
          });
          return;
        }

        set({ currentIndex: currentIndex + 1 });
      },

      resetGame: () => {
        const { allItems } = get();
        if (allItems.length === 0) return;
        set(
          freshProgress(
            selectRandom(allItems, Math.min(ORTOGRAFIA_ROUND_SIZE, allItems.length))
          )
        );
      },
    }),
    {
      name: 'taller-ortografia-storage',
      partialize: (state) => ({
        allItems: state.allItems,
        roundItems: state.roundItems,
        currentIndex: state.currentIndex,
        hearts: state.hearts,
        xp: state.xp,
        badge: state.badge,
        gameStatus: state.gameStatus,
        showInstructions: state.showInstructions,
      }),
    }
  )
);
