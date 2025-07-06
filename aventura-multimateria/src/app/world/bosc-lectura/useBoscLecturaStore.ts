import { create } from 'zustand';

interface BoscLecturaState {
  energy: number;
  currentPassage: number;
  answers: Record<string, boolean>;
  completed: boolean;
  xp: number;
  badge: boolean;
  showInstructions: boolean;
  reset: () => void;
  loseHeart: () => void;
  answer: (qid: string, correct: boolean) => void;
  addXp: (amount: number) => void;
  setCompleted: () => void;
  setBadge: () => void;
  startGame: () => void;
}

export const useBoscLecturaStore = create<BoscLecturaState>((set) => ({
  energy: 5,
  currentPassage: 0,
  answers: {},
  completed: false,
  xp: 0,
  badge: false,
  showInstructions: true,
  reset: () => set({ energy: 5, currentPassage: 0, answers: {}, completed: false, xp: 0, badge: false, showInstructions: true }),
  loseHeart: () => set((state) => ({ energy: Math.max(0, state.energy - 1) })),
  answer: (qid, correct) => set((state) => ({ answers: { ...state.answers, [qid]: correct } })),
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  setCompleted: () => set({ completed: true }),
  setBadge: () => set({ badge: true }),
  startGame: () => set({ showInstructions: false }),
}));
