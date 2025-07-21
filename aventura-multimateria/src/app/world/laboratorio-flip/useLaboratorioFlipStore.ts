import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, FlipLesson, EXPERIMENT_PIECES } from './types';
import flipLessons from '../../data/flip-lessons.json';

interface LaboratorioFlipStore extends GameState {
  initializeGame: () => void;
  showInstructionsScreen: () => void;
  hideInstructionsScreen: () => void;
  startVideo: () => void;
  finishVideo: () => void;
  startQuiz: () => void;
  selectAnswer: (questionIndex: number, answerIndex: number) => void;
  submitQuiz: () => void;
  retryLesson: () => void;
  nextLesson: () => void;
  awardXP: (amount: number) => void;
  awardPiece: (pieceIndex: number) => void;
  showFeedback: (success: boolean, message: string, explanation?: string) => void;
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

      initializeGame: () => {
        const randomLessons = get().getRandomLessons();
        set({
          currentLesson: 0,
          answers: [null, null, null],
          completedLessons: 0,
          piecesObtained: 0,
          lessons: randomLessons,
          experimentPieces: EXPERIMENT_PIECES.map(piece => ({ ...piece, obtained: false })),
          feedback: null,
          gameStatus: 'playing',
          badge: false,
          videoWatched: false,
          quizStarted: false,
        });
      },

      showInstructionsScreen: () => {
        set({ showInstructions: true, gameStatus: 'instructions' });
      },

      hideInstructionsScreen: () => {
        set({ showInstructions: false, gameStatus: 'video' });
      },

      startVideo: () => {
        set({ gameStatus: 'video', videoWatched: false });
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
            answers: [null, null, null] 
          });
        }
      },

      selectAnswer: (questionIndex: number, answerIndex: number) => {
        set(state => {
          const newAnswers = [...state.answers];
          newAnswers[questionIndex] = answerIndex;
          return { answers: newAnswers };
        });
      },

      submitQuiz: () => {
        const { answers } = get();
        
        // Verificar que todas las preguntas estén respondidas
        if (answers.some(answer => answer === null)) {
          get().showFeedback(false, 'Por favor, responde todas las preguntas antes de continuar.');
          return;
        }

        const correctCount = get().getCorrectAnswersCount();
        
        // Dar XP por cada respuesta correcta
        get().awardXP(correctCount * 8);

        if (correctCount >= 2) {
          // Éxito: añadir pieza del experimento
          const pieceIndex = get().piecesObtained;
          get().awardPiece(pieceIndex);
          get().awardXP(10); // XP extra por completar la lección
          
          get().showFeedback(
            true, 
            `¡Excelente! Has obtenido ${correctCount}/3 respuestas correctas.`,
            `Has añadido una pieza al experimento: ${EXPERIMENT_PIECES[pieceIndex].name} ${EXPERIMENT_PIECES[pieceIndex].icon}`
          );
          
          const { completedLessons } = get();
          if (completedLessons + 1 >= 4) {
            // Completar el juego
            setTimeout(() => {
              set({ 
                gameStatus: 'completed', 
                badge: true,
                completedLessons: completedLessons + 1
              });
              get().awardXP(60); // Bonus final
            }, 3000);
          } else {
            // Siguiente lección
            setTimeout(() => {
              get().nextLesson();
            }, 3000);
          }
        } else {
          // Falló: repetir lección
          get().showFeedback(
            false, 
            `Has obtenido ${correctCount}/3 respuestas correctas. Necesitas al menos 2 para continuar.`,
            'Vuelve a ver el vídeo y repite el quiz.'
          );
          
          setTimeout(() => {
            get().retryLesson();
          }, 3000);
        }
      },

      retryLesson: () => {
        set({ 
          gameStatus: 'video',
          answers: [null, null, null],
          videoWatched: false,
          quizStarted: false,
          feedback: null
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
          feedback: null
        });
      },

      awardXP: (amount: number) => {
        set(state => ({
          xp: state.xp + amount,
        }));
      },

      awardPiece: (pieceIndex: number) => {
        set(state => {
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

      showFeedback: (success: boolean, message: string, explanation?: string) => {
        set({
          feedback: {
            show: true,
            success,
            message,
            explanation,
          },
        });
      },

      hideFeedback: () => {
        set({ feedback: null });
      },

      getRandomLessons: () => {
        const allLessons = flipLessons as FlipLesson[];
        const shuffled = [...allLessons].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 4); // Seleccionar 4 lecciones aleatorias
      },

      getCorrectAnswersCount: () => {
        const { answers, lessons, currentLesson } = get();
        const lesson = lessons[currentLesson];
        
        return answers.reduce((count, answer, index) => {
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
        xp: state.xp,
        completedLessons: state.completedLessons,
        piecesObtained: state.piecesObtained,
        badge: state.badge,
      }),
    }
  )
);

export default useLaboratorioFlipStore;