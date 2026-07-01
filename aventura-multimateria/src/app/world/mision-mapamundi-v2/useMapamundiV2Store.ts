import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapamundiTask, GameMode, MODE_CONFIG } from './types';
import { shuffle } from '../shared/random';

interface MapamundiV2Store {
  currentTask: number;
  lives: number;
  completedStamps: number;
  xp: number;
  tasks: MapamundiTask[];
  taskPool: MapamundiTask[];
  selectedRegion: string | null;
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackParams?: Record<string, string | number>;
  feedbackType: 'success' | 'error';
  gameStatus: 'playing' | 'completed' | 'gameOver';
  mode: GameMode;
  maxQuestions: number;

  initializeGame: (mode: GameMode, allTasks: MapamundiTask[]) => void;
  selectRegion: (regionId: string) => void;
  submitAnswer: () => void;
  nextTask: () => void;
  resetGame: () => void;
  showFeedbackAction: (type: 'success' | 'error', message: string, params?: Record<string, string | number>) => void;
  hideFeedback: () => void;
  gainXP: (amount: number) => void;
  completeWorld: () => void;
}

export const useMapamundiV2Store = create<MapamundiV2Store>()(
  persist(
    (set, get) => ({
      currentTask: 0,
      lives: 5,
      completedStamps: 0,
      xp: 0,
      tasks: [],
      taskPool: [],
      selectedRegion: null,
      showFeedback: false,
      feedbackMessage: '',
      feedbackType: 'success',
      gameStatus: 'playing',
      mode: 'continent',
      maxQuestions: 7,

      initializeGame: (mode: GameMode, allTasks: MapamundiTask[]) => {
        const config = MODE_CONFIG[mode];
        const modeTasks = allTasks.filter((task) => task.mode === mode);
        const shuffledTasks = shuffle(modeTasks).slice(0, config.maxQuestions);

        set({
          mode,
          taskPool: allTasks,
          maxQuestions: config.maxQuestions,
          currentTask: 0,
          lives: 5,
          completedStamps: 0,
          xp: 0,
          tasks: shuffledTasks,
          selectedRegion: null,
          showFeedback: false,
          feedbackMessage: '',
          feedbackType: 'success',
          gameStatus: 'playing',
        });
      },

      selectRegion: (regionId: string) => {
        set({ selectedRegion: regionId });
      },

      submitAnswer: () => {
        const { selectedRegion, tasks, currentTask, lives, completedStamps, mode } = get();
        const config = MODE_CONFIG[mode];
        const currentTaskData = tasks[currentTask];

        if (!selectedRegion || !currentTaskData) return;

        const isCorrect = selectedRegion === currentTaskData.targetId;

        if (isCorrect) {
          const newCompletedStamps = completedStamps + 1;
          const isGameCompleted = newCompletedStamps >= config.maxQuestions;
          get().gainXP(config.xpPerCorrect);

          set({
            completedStamps: newCompletedStamps,
            selectedRegion: null,
            gameStatus: isGameCompleted ? 'completed' : 'playing',
          });

          if (isGameCompleted) {
            get().gainXP(config.bonusXP);
          }
        } else {
          const newLives = lives - 1;
          set({
            lives: newLives,
            selectedRegion: null,
            gameStatus: newLives <= 0 ? 'gameOver' : 'playing',
          });
        }
      },

      nextTask: () => {
        const { currentTask, tasks } = get();
        if (currentTask < tasks.length - 1) {
          set({
            currentTask: currentTask + 1,
            selectedRegion: null,
          });
        }
      },

      resetGame: () => {
        const { mode, taskPool } = get();
        if (taskPool.length > 0) {
          get().initializeGame(mode, taskPool);
        }
      },

      showFeedbackAction: (type: 'success' | 'error', message: string, params?: Record<string, string | number>) => {
        set({
          showFeedback: true,
          feedbackType: type,
          feedbackMessage: message,
          feedbackParams: params,
        });
      },

      hideFeedback: () => {
        set({
          showFeedback: false,
          feedbackMessage: '',
          feedbackParams: undefined,
        });
      },

      gainXP: (amount: number) => {
        set({ xp: get().xp + amount });
      },

      completeWorld: () => {
        get().resetGame();
      },
    }),
    {
      name: 'mapamundi-v2-session',
      partialize: (state) => ({
        currentTask: state.currentTask,
        lives: state.lives,
        completedStamps: state.completedStamps,
        xp: state.xp,
        tasks: state.tasks,
        taskPool: state.taskPool,
        mode: state.mode,
        maxQuestions: state.maxQuestions,
        gameStatus: state.gameStatus,
      }),
    }
  )
);
