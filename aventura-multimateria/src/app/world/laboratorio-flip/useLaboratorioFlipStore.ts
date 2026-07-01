import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, FlipLesson, EXPERIMENT_PIECES } from './types';
import flipLessons from '../../data/flip-lessons.json';
import { selectRandom } from '../shared/random';

type PendingQuizAction = 'nextLesson' | 'retry' | 'complete' | null;

interface LaboratorioFlipStore extends GameState {
  pendingQuizAction: PendingQuizAction;
  initializeGame: () => void;
  showInstructionsScreen: () => void;
  hideInstructionsScreen: () => void;
  startVideo: () => void;
  finishVideo: () => void;
  startQuiz: () => void;
  selectAnswer: (questionIndex: number, answerIndex: number) => void;
  submitQuiz: () => void;
  applyPendingQuizAction: () => void;
  retryLesson: () => void;
  nextLesson: () => void;
  awardXP: (amount: number) => void;
  awardPiece: (pieceIndex: number) => void;
  showFeedback: (
    success: boolean,
    message: string,
    explanation?: string,
    messageParams?: Record<string, string | number>,
    explanationParams?: Record<string, string | number>
  ) => void;
  hideFeedback: () => void;
  getRandomLessons: () => FlipLesson[];
  getCorrectAnswersCount: () => number;
}

const useLaboratorioFlipStore = create<LaboratorioFlipStore>()(
  persist(
    (set, get) => ({
      currentLesson: 0,
      answers: [null, null, null],
      completedLessons: 0,
      piecesObtained: 0,
      xp: 0,
      lessons: [],
      experimentPieces: [...EXPERIMENT_PIECES],
      feedback: null,
      gameStatus: 'instructions',
      badge: false,
      showInstructions: true,
      videoWatched: false,
      quizStarted: false,
      pendingQuizAction: null,

      initializeGame: () => {
        const randomLessons = get().getRandomLessons();
        set({
          currentLesson: 0,
          answers: [null, null, null],
          completedLessons: 0,
          piecesObtained: 0,
          xp: 0,
          lessons: randomLessons,
          experimentPieces: EXPERIMENT_PIECES.map((piece) => ({ ...piece, obtained: false })),
          feedback: null,
          gameStatus: 'playing',
          badge: false,
          videoWatched: false,
          quizStarted: false,
          showInstructions: false,
          pendingQuizAction: null,
        });
      },

      showInstructionsScreen: () => {
        set({ showInstructions: true, gameStatus: 'instructions' });
      },

      hideInstructionsScreen: () => {
        const state = get();
        if (state.lessons.length === 0) {
          get().initializeGame();
        } else {
          set({ showInstructions: false, gameStatus: 'video' });
        }
      },

      startVideo: () => {
        set({ gameStatus: 'video', videoWatched: false, quizStarted: false });
      },

      finishVideo: () => {
        set({ videoWatched: true });
      },

      startQuiz: () => {
        const { videoWatched } = get();
        if (videoWatched) {
          set({
            gameStatus: 'quiz',
            quizStarted: true,
            answers: [null, null, null],
          });
        }
      },

      selectAnswer: (questionIndex: number, answerIndex: number) => {
        set((state) => {
          const newAnswers = [...state.answers];
          newAnswers[questionIndex] = answerIndex;
          return { answers: newAnswers };
        });
      },

      submitQuiz: () => {
        const { answers } = get();

        if (answers.some((answer) => answer === null)) {
          get().showFeedback(false, 'flip.feedback.answerAll');
          return;
        }

        const correctCount = get().getCorrectAnswersCount();
        get().awardXP(correctCount * 8);

        if (correctCount >= 2) {
          const pieceIndex = get().piecesObtained;
          get().awardPiece(pieceIndex);
          get().awardXP(10);

          const { completedLessons } = get();
          const willComplete = completedLessons + 1 >= 4;

          const piece = EXPERIMENT_PIECES[pieceIndex];
          get().showFeedback(
            true,
            'flip.feedback.success',
            'flip.feedback.pieceAdded',
            { count: correctCount },
            { name: piece.name, icon: piece.icon }
          );

          if (willComplete) {
            set({ pendingQuizAction: 'complete' });
            get().awardXP(60);
          } else {
            set({ pendingQuizAction: 'nextLesson' });
          }
        } else {
          get().showFeedback(
            false,
            'flip.feedback.fail',
            'flip.feedback.retryHint',
            { count: correctCount }
          );
          set({ pendingQuizAction: 'retry' });
        }
      },

      applyPendingQuizAction: () => {
        const action = get().pendingQuizAction;
        set({ pendingQuizAction: null });

        switch (action) {
          case 'complete':
            set({
              gameStatus: 'completed',
              badge: true,
              completedLessons: get().completedLessons + 1,
            });
            break;
          case 'nextLesson':
            get().nextLesson();
            break;
          case 'retry':
            get().retryLesson();
            break;
          default:
            break;
        }
      },

      retryLesson: () => {
        set({
          gameStatus: 'video',
          answers: [null, null, null],
          videoWatched: false,
          quizStarted: false,
          feedback: null,
          pendingQuizAction: null,
        });
      },

      nextLesson: () => {
        const { currentLesson, completedLessons } = get();
        set({
          currentLesson: currentLesson + 1,
          completedLessons: completedLessons + 1,
          gameStatus: 'video',
          answers: [null, null, null],
          videoWatched: false,
          quizStarted: false,
          feedback: null,
          pendingQuizAction: null,
        });
      },

      awardXP: (amount: number) => {
        set((state) => ({ xp: state.xp + amount }));
      },

      awardPiece: (pieceIndex: number) => {
        set((state) => {
          const newPieces = [...state.experimentPieces];
          if (pieceIndex < newPieces.length) {
            newPieces[pieceIndex] = { ...newPieces[pieceIndex], obtained: true };
          }
          return {
            experimentPieces: newPieces,
            piecesObtained: state.piecesObtained + 1,
          };
        });
      },

      showFeedback: (
        success: boolean,
        message: string,
        explanation?: string,
        messageParams?: Record<string, string | number>,
        explanationParams?: Record<string, string | number>
      ) => {
        set({
          feedback: { show: true, success, message, explanation, messageParams, explanationParams },
        });
      },

      hideFeedback: () => {
        const hadPending = get().pendingQuizAction !== null;
        set({ feedback: null });
        if (hadPending) {
          get().applyPendingQuizAction();
        }
      },

      getRandomLessons: () => {
        return selectRandom(flipLessons as FlipLesson[], 4);
      },

      getCorrectAnswersCount: () => {
        const { answers, lessons, currentLesson } = get();
        const lesson = lessons[currentLesson];
        if (!lesson) return 0;

        return answers.reduce<number>((count, answer, index) => {
          if (answer !== null && answer === lesson.questions[index].answer) {
            return count + 1;
          }
          return count;
        }, 0);
      },
    }),
    {
      name: 'laboratorio-flip-storage',
      partialize: (state) => ({
        currentLesson: state.currentLesson,
        answers: state.answers,
        completedLessons: state.completedLessons,
        piecesObtained: state.piecesObtained,
        xp: state.xp,
        lessons: state.lessons,
        experimentPieces: state.experimentPieces,
        gameStatus: state.gameStatus,
        badge: state.badge,
        showInstructions: state.showInstructions,
        videoWatched: state.videoWatched,
        quizStarted: state.quizStarted,
      }),
    }
  )
);

export default useLaboratorioFlipStore;
