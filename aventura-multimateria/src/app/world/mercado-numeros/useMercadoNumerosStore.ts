import { create } from 'zustand';
import type { MercadoTask, GameState } from './types';

interface MercadoNumerosState extends GameState {
  // Actions
  loadTasks: (tasks: MercadoTask[]) => void;
  startGame: () => void;
  selectCoin: (value: number) => void;
  removeCoin: (index: number) => void;
  submitPayment: () => void;
  selectTimeAnswer: (answer: number) => void;
  submitTimeAnswer: () => void;
  setFractionAnswer: (answer: number) => void;
  submitFractionAnswer: () => void;
  nextTask: () => void;
  showFeedback: (correct: boolean, message: string) => void;
  hideFeedback: () => void;
  loseHeart: () => void;
  gainXP: (amount: number) => void;
  completeBasket: () => void;
  reset: () => void;
  completeGame: () => void;
}

const initialState: GameState = {
  currentTask: 0,
  completedBaskets: 0,
  hearts: 3,
  xp: 0,
  tasks: [],
  selectedCoins: [],
  currentAnswer: null,
  feedback: null,
  gameStatus: "instructions",
  badge: false,
};

export const useMercadoNumerosStore = create<MercadoNumerosState>((set, get) => ({
  ...initialState,

  loadTasks: (tasks: MercadoTask[]) => {
    // Seleccionar 8 tareas aleatorias mezclando los 3 tipos
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    const selectedTasks = shuffled.slice(0, 8);
    
    set({ 
      tasks: selectedTasks,
      currentTask: 0,
      completedBaskets: 0,
      hearts: 3,
      xp: 0,
      selectedCoins: [],
      currentAnswer: null,
      feedback: null,
      gameStatus: "instructions",
      badge: false,
    });
  },

  startGame: () => {
    set({ gameStatus: "playing" });
  },

  selectCoin: (value: number) => {
    const { selectedCoins } = get();
    const total = selectedCoins.reduce((sum, coin) => sum + coin, 0) + value;
    
    // No permitir exceder 10€
    if (total <= 10) {
      set({ selectedCoins: [...selectedCoins, value] });
    }
  },

  removeCoin: (index: number) => {
    const { selectedCoins } = get();
    const newCoins = selectedCoins.filter((_, i) => i !== index);
    set({ selectedCoins: newCoins });
  },

  submitPayment: () => {
    const { selectedCoins, tasks, currentTask } = get();
    const task = tasks[currentTask] as any; // PaymentTask
    const total = selectedCoins.reduce((sum, coin) => sum + coin, 0);
    const targetAmount = task.amount;
    
    const correct = Math.abs(total - targetAmount) < 0.01; // Tolerancia para decimales
    
    if (correct) {
      get().completeBasket();
      get().gainXP(15);
      get().showFeedback(true, `¡Perfecto! Pagaste exactamente €${targetAmount.toFixed(2)}`);
    } else {
      get().loseHeart();
      get().showFeedback(false, `No es correcto. ${task.explanation}`);
    }
  },

  selectTimeAnswer: (answer: number) => {
    set({ currentAnswer: answer });
  },

  submitTimeAnswer: () => {
    const { currentAnswer, tasks, currentTask } = get();
    const task = tasks[currentTask] as any; // TimeTask
    
    const correct = currentAnswer === task.answer;
    
    if (correct) {
      get().completeBasket();
      get().gainXP(15);
      get().showFeedback(true, "¡Correcto! Calculaste bien el tiempo restante.");
    } else {
      get().loseHeart();
      get().showFeedback(false, `No es correcto. ${task.explanation}`);
    }
  },

  setFractionAnswer: (answer: number) => {
    set({ currentAnswer: answer });
  },

  submitFractionAnswer: () => {
    const { currentAnswer, tasks, currentTask } = get();
    const task = tasks[currentTask] as any; // FractionTask
    
    const correct = currentAnswer === task.answer;
    
    if (correct) {
      get().completeBasket();
      get().gainXP(15);
      get().showFeedback(true, "¡Excelente! Resolviste la fracción correctamente.");
    } else {
      get().loseHeart();
      get().showFeedback(false, `No es correcto. ${task.explanation}`);
    }
  },

  nextTask: () => {
    const { currentTask, tasks, completedBaskets } = get();
    
    set({ 
      selectedCoins: [],
      currentAnswer: null,
      feedback: null 
    });

    if (currentTask + 1 >= tasks.length || completedBaskets >= 8) {
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

  completeBasket: () => {
    const { completedBaskets } = get();
    set({ completedBaskets: completedBaskets + 1 });
  },

  completeGame: () => {
    const { hearts, xp } = get();
    const bonusXP = hearts > 0 ? 80 : 0;
    const badge = hearts > 0;
    
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
      gameStatus: "instructions"
    });
  },
}));