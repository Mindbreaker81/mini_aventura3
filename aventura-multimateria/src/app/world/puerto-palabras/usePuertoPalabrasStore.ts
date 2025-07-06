import { create, StateCreator } from "zustand";
import type { PuertoWord } from "./dragdrop-utils";

export interface PuertoPalabrasState {
  words: PuertoWord[];
  roundWords: PuertoWord[];
  assigned: Record<string, string | null>; // word -> category
  repaired: number;
  feedback: { word: string; correct: boolean; rule: string } | null;
  xp: number;
  badge: boolean;
  showInstructions: boolean;
  loadWords: (all: PuertoWord[]) => void;
  assignWord: (word: string, category: string) => void;
  nextRound: () => void;
  reset: () => void;
  startGame: () => void;
}

export const usePuertoPalabrasStore = create<PuertoPalabrasState>((set, get) => ({
  words: [],
  roundWords: [],
  assigned: {},
  repaired: 0,
  feedback: null,
  xp: 0,
  badge: false,
  showInstructions: true,
  loadWords: (all: PuertoWord[]) => {
    // Deduplicar palabras por su valor antes de seleccionar aleatoriamente
    const uniqueWords = all.filter((word, index, self) => 
      index === self.findIndex(w => w.word === word.word)
    );
    
    // Selecciona 10 palabras aleatorias para la ronda
    const shuffled = [...uniqueWords].sort(() => Math.random() - 0.5);
    set({
      words: uniqueWords,
      roundWords: shuffled.slice(0, 10),
      assigned: {},
      repaired: 0,
      feedback: null,
      xp: 0,
      badge: false,
      showInstructions: true,
    });
  },
  assignWord: (word: string, category: string) => {
    const { roundWords, assigned, repaired, xp } = get();
    const w = roundWords.find((w: PuertoWord) => w.word === word);
    if (!w) return;
    const correct = w.category === category;
    set({
      assigned: { ...assigned, [word]: category },
      repaired: correct ? repaired + 1 : repaired,
      feedback: { word, correct, rule: w.rule },
      xp: correct ? xp + 10 : xp,
    });
  },
  nextRound: () => {
    set({ feedback: null });
  },
  reset: () => {
    set({
      roundWords: [],
      assigned: {},
      repaired: 0,
      feedback: null,
      xp: 0,
      badge: false,
      showInstructions: true,
    });
  },
  startGame: () => {
    set({ showInstructions: false });
  },
}));
