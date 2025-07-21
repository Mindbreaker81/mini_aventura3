import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapamundiTask, GameMode, MODE_CONFIG } from './types';
import tasksData from '../../data/mapamundi-tasks.json';

// Función para mezclar array (shuffle)
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface MapamundiV2Store {
  // Estado del juego
  currentTask: number;
  lives: number;
  completedStamps: number;
  tasks: MapamundiTask[];
  selectedRegion: string | null;
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'success' | 'error';
  gameStatus: 'playing' | 'completed' | 'gameOver';
  mode: GameMode;
  maxQuestions: number;

  // Acciones del juego
  initializeGame: (mode: GameMode) => void;
  selectRegion: (regionId: string) => void;
  submitAnswer: () => void;
  nextTask: () => void;
  resetGame: () => void;
  showFeedbackAction: (type: 'success' | 'error', message: string) => void;
  hideFeedback: () => void;
  gainXP: (amount: number) => void;
  completeWorld: () => void;
}

export const useMapamundiV2Store = create<MapamundiV2Store>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentTask: 0,
      lives: 5,
      completedStamps: 0,
      tasks: [],
      selectedRegion: null,
      showFeedback: false,
      feedbackMessage: '',
      feedbackType: 'success',
      gameStatus: 'playing',
      mode: 'continent',
      maxQuestions: 7,

      // Acciones del juego
      initializeGame: (mode: GameMode) => {
        const config = MODE_CONFIG[mode];
        
        // Filtrar tareas por modo y mezclar
        const modeTasks = (tasksData as MapamundiTask[]).filter((task) => task.mode === mode);
        const shuffledTasks = shuffle(modeTasks).slice(0, config.maxQuestions);
        
        set({
          mode,
          maxQuestions: config.maxQuestions,
          currentTask: 0,
          lives: 5,
          completedStamps: 0,
          tasks: shuffledTasks,
          selectedRegion: null,
          showFeedback: false,
          feedbackMessage: '',
          feedbackType: 'success',
          gameStatus: 'playing'
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
          // Acierto
          const newCompletedStamps = completedStamps + 1;
          const isGameCompleted = newCompletedStamps >= config.maxQuestions;
          
          console.log(`Acierto! Sellos completados: ${newCompletedStamps}/${config.maxQuestions}`); // Debug
          
          set({
            completedStamps: newCompletedStamps,
            selectedRegion: null,
            gameStatus: isGameCompleted ? 'completed' : 'playing'
          });
        } else {
          // Error
          const newLives = lives - 1;
          const isGameOver = newLives <= 0;
          
          console.log(`Error! Vidas restantes: ${newLives}`); // Debug
          
          set({
            lives: newLives,
            selectedRegion: null,
            gameStatus: isGameOver ? 'gameOver' : 'playing'
          });
        }
      },

      nextTask: () => {
        const { currentTask, tasks } = get();
        
        if (currentTask < tasks.length - 1) {
          set({
            currentTask: currentTask + 1,
            selectedRegion: null
          });
        }
      },

      resetGame: () => {
        const { mode } = get();
        get().initializeGame(mode);
      },

      // Acciones de UI
      showFeedbackAction: (type: 'success' | 'error', message: string) => {
        set({
          showFeedback: true,
          feedbackType: type,
          feedbackMessage: message
        });
      },

      hideFeedback: () => {
        set({
          showFeedback: false,
          feedbackMessage: ''
        });
      },

      // XP y recompensas
      gainXP: (amount: number) => {
        // Aquí se integraría con el sistema de XP global
        console.log(`Ganaste ${amount} XP`);
      },

      completeWorld: () => {
        const { mode, completedStamps } = get();
        const config = MODE_CONFIG[mode];
        
        // Calcular XP total
        const xpFromCorrect = completedStamps * config.xpPerCorrect;
        const totalXP = xpFromCorrect + config.bonusXP;
        
        // Aquí se llamaría a Supabase
        console.log(`Completado mundo: mision-mapamundi-${mode}`);
        console.log(`XP total: ${totalXP}`);
        console.log(`Badge: ${config.badge.name}`);
        
        // Limpiar estado
        set({
          gameStatus: 'playing',
          currentTask: 0,
          lives: 5,
          completedStamps: 0,
          tasks: [],
          selectedRegion: null
        });
      }
    }),
    {
      name: 'mapamundi-v2-session', // Clave fija para simplificar
      partialize: (state) => ({
        currentTask: state.currentTask,
        lives: state.lives,
        completedStamps: state.completedStamps,
        tasks: state.tasks,
        mode: state.mode,
        maxQuestions: state.maxQuestions,
        gameStatus: state.gameStatus
      })
    }
  )
); 