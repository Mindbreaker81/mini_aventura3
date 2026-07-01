import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStatus } from '../shared/types';
import { selectRandom } from '../shared/random';

export interface BoscQuestion {
  q: string;
  type: 'single' | 'true_false';
  options?: string[];
  answer: number | boolean;
  explanation: string;
}

export interface BoscPassage {
  id: number;
  title: string;
  paragraph: string;
  questions: BoscQuestion[];
}

interface BoscLecturaState {
  energy: number;
  currentPassage: number;
  currentQuestionIndex: number;
  selectedPassages: BoscPassage[];
  answers: Record<string, boolean>;
  completed: boolean;
  gameStatus: GameStatus;
  xp: number;
  badge: boolean;
  showInstructions: boolean;
  initializeGame: (all: BoscPassage[]) => void;
  reset: () => void;
  loseHeart: () => void;
  answer: (qid: string, correct: boolean) => void;
  addXp: (amount: number) => void;
  setCompleted: () => void;
  setBadge: () => void;
  startGame: () => void;
  nextQuestion: () => void;
}

const initialProgress = {
  energy: 5,
  currentPassage: 0,
  currentQuestionIndex: 0,
  answers: {} as Record<string, boolean>,
  completed: false,
  xp: 0,
  badge: false,
};

export const useBoscLecturaStore = create<BoscLecturaState>()(
  persist(
    (set, get) => ({
      ...initialProgress,
      selectedPassages: [],
      gameStatus: 'instructions',
      showInstructions: true,

      initializeGame: (all: BoscPassage[]) => {
        const maxPassages = Math.min(6, all.length);
        set({
          ...initialProgress,
          selectedPassages: selectRandom(all, maxPassages),
          gameStatus: 'playing',
          showInstructions: false,
        });
      },

      reset: () =>
        set({
          ...initialProgress,
          selectedPassages: [],
          gameStatus: 'instructions',
          showInstructions: true,
        }),

      loseHeart: () => {
        const energy = Math.max(0, get().energy - 1);
        set({
          energy,
          gameStatus: energy === 0 ? 'failed' : get().gameStatus,
        });
      },

      answer: (qid, correct) =>
        set((state) => ({ answers: { ...state.answers, [qid]: correct } })),

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

      setCompleted: () => set({ completed: true, gameStatus: 'completed' }),

      setBadge: () => set({ badge: true }),

      startGame: () => set({ showInstructions: false, gameStatus: 'playing' }),

      nextQuestion: () => {
        const { selectedPassages, currentPassage, currentQuestionIndex } = get();
        const passage = selectedPassages[currentPassage];
        if (!passage) return;

        const isLastQuestion = currentQuestionIndex >= passage.questions.length - 1;

        if (!isLastQuestion) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
          return;
        }

        if (currentPassage < selectedPassages.length - 1) {
          set({ currentPassage: currentPassage + 1, currentQuestionIndex: 0 });
          return;
        }

        get().setCompleted();
        if (get().energy > 0) {
          get().addXp(60);
          get().setBadge();
        }
      },
    }),
    {
      name: 'bosc-lectura-storage',
      partialize: (state) => ({
        energy: state.energy,
        currentPassage: state.currentPassage,
        currentQuestionIndex: state.currentQuestionIndex,
        selectedPassages: state.selectedPassages,
        answers: state.answers,
        completed: state.completed,
        gameStatus: state.gameStatus,
        xp: state.xp,
        badge: state.badge,
        showInstructions: state.showInstructions,
      }),
    }
  )
);
