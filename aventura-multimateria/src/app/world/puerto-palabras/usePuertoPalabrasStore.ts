import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PuertoWord } from "./dragdrop-utils";
import type { GameStatus } from "../shared/types";
import { WIN_REPAIRED_TARGET } from "../shared/types";
import { selectRandom } from "../shared/random";

const WORDS_POOL_ID = "words";

export interface PuertoPalabrasState {
  words: PuertoWord[];
  roundWords: PuertoWord[];
  assigned: Record<string, string>;
  correctWords: string[];
  repaired: number;
  feedback: { word: string; correct: boolean; rule: string } | null;
  xp: number;
  badge: boolean;
  gameStatus: GameStatus;
  showInstructions: boolean;
  loadWords: (all: PuertoWord[]) => void;
  assignWord: (word: string, category: string) => void;
  unassignWord: (word: string) => void;
  hideFeedback: () => void;
  resetGame: () => void;
  startGame: () => void;
}

const freshRoundState = (roundWords: PuertoWord[]) => ({
  roundWords,
  assigned: {} as Record<string, string>,
  correctWords: [] as string[],
  repaired: 0,
  feedback: null,
  xp: 0,
  badge: false,
  gameStatus: "instructions" as GameStatus,
  showInstructions: true,
});

export const usePuertoPalabrasStore = create<PuertoPalabrasState>()(
  persist(
    (set, get) => ({
      words: [],
      roundWords: [],
      assigned: {},
      correctWords: [],
      repaired: 0,
      feedback: null,
      xp: 0,
      badge: false,
      gameStatus: "instructions",
      showInstructions: true,

      loadWords: (all: PuertoWord[]) => {
        const uniqueWords = all.filter(
          (word, index, self) =>
            index === self.findIndex((w) => w.word === word.word)
        );
        const roundWords = selectRandom(uniqueWords, 10);
        set({
          words: uniqueWords,
          ...freshRoundState(roundWords),
        });
      },

      assignWord: (word: string, category: string) => {
        const state = get();
        if (state.gameStatus === "completed") return;

        const w = state.roundWords.find((item) => item.word === word);
        if (!w) return;

        if (category === WORDS_POOL_ID) {
          get().unassignWord(word);
          return;
        }

        const correct = w.category === category;
        const alreadyCorrect = state.correctWords.includes(word);

        if (correct) {
          if (!alreadyCorrect) {
            const newRepaired = state.repaired + 1;
            const completed = newRepaired >= WIN_REPAIRED_TARGET;
            set({
              assigned: { ...state.assigned, [word]: category },
              correctWords: [...state.correctWords, word],
              repaired: newRepaired,
              xp: state.xp + 10,
              feedback: { word, correct: true, rule: w.rule },
              gameStatus: completed ? "completed" : "playing",
              badge: completed,
            });
          } else {
            set({
              assigned: { ...state.assigned, [word]: category },
              feedback: { word, correct: true, rule: w.rule },
            });
          }
          return;
        }

        set({
          feedback: { word, correct: false, rule: w.rule },
        });
      },

      unassignWord: (word: string) => {
        const state = get();
        const wasCorrect = state.correctWords.includes(word);
        const newAssigned = { ...state.assigned };
        delete newAssigned[word];

        set({
          assigned: newAssigned,
          correctWords: state.correctWords.filter((w) => w !== word),
          repaired: wasCorrect ? Math.max(0, state.repaired - 1) : state.repaired,
          xp: wasCorrect ? Math.max(0, state.xp - 10) : state.xp,
          badge: false,
          gameStatus: state.gameStatus === "completed" ? "playing" : state.gameStatus,
          feedback: null,
        });
      },

      hideFeedback: () => set({ feedback: null }),

      resetGame: () => {
        const { words } = get();
        if (words.length === 0) return;
        set(freshRoundState(selectRandom(words, 10)));
      },

      startGame: () => {
        set({ showInstructions: false, gameStatus: "playing" });
      },
    }),
    {
      name: "puerto-palabras-storage",
      partialize: (state) => ({
        words: state.words,
        roundWords: state.roundWords,
        assigned: state.assigned,
        correctWords: state.correctWords,
        repaired: state.repaired,
        xp: state.xp,
        badge: state.badge,
        gameStatus: state.gameStatus,
        showInstructions: state.showInstructions,
      }),
    }
  )
);

export { WORDS_POOL_ID };
