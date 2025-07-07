import { create } from 'zustand';
import type { MapamundiTask, GameState } from './types';
import { CONTINENT_ID_TO_NAME } from './types';

interface MisionMapamundiState extends GameState {
  // Actions
  loadTasks: (tasks: MapamundiTask[]) => void;
  startGame: () => void;
  selectRegion: (regionId: string) => void;
  selectContinent: (continentName: string) => void;
  selectOcean: (oceanId: string) => void;
  submitAnswer: () => void;
  nextTask: () => void;
  showFeedback: (correct: boolean, message: string) => void;
  hideFeedback: () => void;
  loseHeart: () => void;
  gainXP: (amount: number) => void;
  completeStamp: () => void;
  reset: () => void;
  completeGame: () => void;
}

const initialState: GameState = {
  currentTask: 0,
  completedStamps: 0,
  hearts: 5,
  xp: 0,
  tasks: [],
  selectedRegion: null,
  feedback: null,
  gameStatus: "instructions",
  badge: false,
  showInstructions: true,
};

export const useMisionMapamundiStore = create<MisionMapamundiState>((set, get) => ({
  ...initialState,

  loadTasks: (tasks: MapamundiTask[]) => {
    // Seleccionar 10 tareas aleatorias mezclando los 3 tipos
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    const selectedTasks = shuffled.slice(0, 10);
    
    set({ 
      tasks: selectedTasks,
      currentTask: 0,
      completedStamps: 0,
      hearts: 5,
      xp: 0,
      selectedRegion: null,
      feedback: null,
      gameStatus: "instructions",
      badge: false,
      showInstructions: true,
    });
  },

  startGame: () => {
    set({ gameStatus: "playing", showInstructions: false });
  },

  // Selección para CCAA y países
  selectRegion: (regionId: string) => {
    console.log('[Store] selectRegion llamado con:', regionId);
    set({ selectedRegion: regionId });
  },

  // Selección para continentes (nombre)
  selectContinent: (continentName: string) => {
    set({ selectedRegion: continentName });
  },

  // Selección para océanos (ID)
  selectOcean: (oceanId: string) => {
    set({ selectedRegion: oceanId });
  },

  submitAnswer: () => {
    const { selectedRegion, tasks, currentTask } = get();
    if (!selectedRegion) return;
    const task = tasks[currentTask];
    let correct = false;
    let feedbackMsg = '';

    if (task.type === "CONTINENT") {
      correct = selectedRegion === task.targetId;
      feedbackMsg = correct
        ? `¡Correcto! ${task.explanation}`
        : `Incorrecto. Seleccionaste: ${selectedRegion}. Respuesta correcta: ${task.targetId}. ${task.explanation}`;
    } else if (task.type === "OCEAN") {
      correct = selectedRegion === task.targetId;
      feedbackMsg = correct
        ? `¡Correcto! ${task.explanation}`
        : `Incorrecto. Seleccionaste: ${selectedRegion}. Respuesta correcta: ${task.targetId}. ${task.explanation}`;
    } else {
      correct = selectedRegion === task.targetId;
      feedbackMsg = correct
        ? `¡Correcto! ${task.explanation}`
        : `Incorrecto. Seleccionaste: ${selectedRegion}. Respuesta correcta: ${task.targetId}. ${task.explanation}`;
    }

    if (correct) {
      get().completeStamp();
      get().gainXP(12);
      get().showFeedback(true, feedbackMsg);
    } else {
      get().loseHeart();
      get().showFeedback(false, feedbackMsg);
    }
  },

  nextTask: () => {
    const { currentTask, tasks, completedStamps } = get();
    set({ 
      selectedRegion: null,
      feedback: null 
    });
    if (currentTask + 1 >= tasks.length || completedStamps >= 10) {
      get().completeGame();
    } else {
      set({ currentTask: currentTask + 1 });
    }
  },

  showFeedback: (correct: boolean, message: string) => {
    set({ 
      feedback: { 
        show: true, 
        correct, 
        message 
      } 
    });
  },

  hideFeedback: () => {
    set({ feedback: null });
  },

  loseHeart: () => {
    const { hearts } = get();
    const newHearts = hearts - 1;
    
    if (newHearts <= 0) {
      set({ hearts: 0, gameStatus: "failed" });
    } else {
      set({ hearts: newHearts });
    }
  },

  gainXP: (amount: number) => {
    const { xp } = get();
    set({ xp: xp + amount });
  },

  completeStamp: () => {
    const { completedStamps } = get();
    set({ completedStamps: completedStamps + 1 });
  },

  completeGame: () => {
    const { hearts, xp, completedStamps } = get();
    const bonusXP = hearts > 0 && completedStamps >= 10 ? 100 : 0;
    const badge = hearts > 0 && completedStamps >= 10;
    
    set({ 
      gameStatus: "completed",
      xp: xp + bonusXP,
      badge
    });
  },

  reset: () => {
    set({
      ...initialState,
      tasks: get().tasks, // Mantener las tareas cargadas
    });
  },
}));