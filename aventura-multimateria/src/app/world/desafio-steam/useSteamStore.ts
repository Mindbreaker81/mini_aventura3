'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import steamTasksData from '../../data/steam-tasks.json';

// --- Types ---
interface RobotState {
  x: number;
  y: number;
  dir: 'N' | 'E' | 'S' | 'W';
}

interface SteamTask {
  id: number;
  description: string;
  gridSize: [number, number];
  start: RobotState;
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  maxBlocks: number;
  ledsToCollect: { x: number; y: number }[];
}

interface SteamState {
  tasks: SteamTask[];
  currentTask: number;
  robot: RobotState;
  goal: { x: number; y: number };
  gridSize: [number, number];
  obstacles: { x: number; y: number }[];
  leds: number;
  ledsToCollect: { x: number; y: number }[];
  collectedLeds: { x: number; y: number }[];
  lives: number;
  xp: number;
  isExecuting: boolean;
  blocklyCode: string;
  showInstructions: boolean;
  gameCompleted: boolean;
  feedback: { show: boolean; type: 'success' | 'error'; message: string } | null;
  badge: { name: string } | null;
  
  // Actions
  initialize: (taskId?: number) => void;
  initializeGame: () => void;
  setBlocklyCode: (code: string) => void;
  executeCode: (code: string) => Promise<void>;
  resetCurrentTask: () => void;
  nextTask: () => void;
  loseLife: () => void;
  hideInstructions: () => void;
  hideFeedback: () => void;
}

// --- Store ---
const useSteamStore = create<SteamState>()(
  persist(
    immer((set, get) => ({
      // --- State ---
      tasks: steamTasksData as SteamTask[],
      currentTask: 0,
      robot: { x: 0, y: 0, dir: 'E' },
      goal: { x: 0, y: 0 },
      gridSize: [5, 5],
      obstacles: [],
      leds: 0,
      ledsToCollect: [],
      collectedLeds: [],
      lives: 3,
      xp: 0,
      isExecuting: false,
      blocklyCode: '',
      showInstructions: true,
      gameCompleted: false,
      feedback: null,
      badge: null,

      // --- Actions ---
      initialize: (taskId) => {
        const { tasks } = get();
        const taskIndex = taskId ?? get().currentTask;
        const task = tasks[taskIndex];

        if (task) {
          set(state => {
            state.currentTask = taskIndex;
            state.robot = { ...task.start };
            state.goal = { ...task.goal };
            state.gridSize = [...task.gridSize];
            state.obstacles = [...task.obstacles];
            state.ledsToCollect = [...task.ledsToCollect];
            state.collectedLeds = [];
            state.leds = 0;
          });
        }
      },
      
      setBlocklyCode: (code) => set({ blocklyCode: code }),

      executeCode: async (code) => {
        set({ isExecuting: true });

        const { gridSize, obstacles, ledsToCollect } = get();
        let tempRobot = { ...get().robot };
        let tempCollectedLeds = [...get().collectedLeds];
        let hasCrashed = false;

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        // --- API de funciones para el código de Blockly ---
        const api = {
          move: async (steps: number = 1) => {
            if (hasCrashed) return;
            for (let i = 0; i < steps; i++) {
              let newX = tempRobot.x, newY = tempRobot.y;
              if (tempRobot.dir === 'N') newY--;
              if (tempRobot.dir === 'S') newY++;
              if (tempRobot.dir === 'W') newX--;
              if (tempRobot.dir === 'E') newX++;

              if (newX < 0 || newX >= gridSize[0] || newY < 0 || newY >= gridSize[1] || obstacles.some(o => o.x === newX && o.y === newY)) {
                hasCrashed = true;
                return;
              }
              
              tempRobot = { ...tempRobot, x: newX, y: newY };
              set({ robot: { ...tempRobot } });
              
              const ledIndex = ledsToCollect.findIndex(l => l.x === tempRobot.x && l.y === tempRobot.y);
              if (ledIndex > -1 && !tempCollectedLeds.some(l => l.x === tempRobot.x && l.y === tempRobot.y)) {
                tempCollectedLeds.push(ledsToCollect[ledIndex]);
                set(state => {
                  state.collectedLeds = [...tempCollectedLeds];
                  state.leds = tempCollectedLeds.length;
                });
              }
              await delay(200);
            }
          },
          turnLeft: async () => {
            if (hasCrashed) return;
            const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'W', 'S', 'E'];
            tempRobot.dir = dirs[(dirs.indexOf(tempRobot.dir) + 1) % 4];
            set({ robot: { ...tempRobot } });
            await delay(100);
          },
          turnRight: async () => {
            if (hasCrashed) return;
            const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W'];
            tempRobot.dir = dirs[(dirs.indexOf(tempRobot.dir) + 1) % 4];
            set({ robot: { ...tempRobot } });
            await delay(100);
          },
        };

        // --- Ejecución segura del código ---
        try {
          // `(async () => { ... })()` es un IIFE asíncrono
          const func = new Function('move', 'turnLeft', 'turnRight', `return (async () => { ${code} })();`);
          await func(api.move, api.turnLeft, api.turnRight);
        } catch (error) {
          console.error("Error ejecutando código de Blockly:", error);
          hasCrashed = true;
        }

        // --- Verificación final ---
        if (hasCrashed) {
          get().loseLife();
        } else {
          const { goal } = get();
          const isSuccess = tempRobot.x === goal.x && tempRobot.y === goal.y && tempCollectedLeds.length === ledsToCollect.length;
          
          if (isSuccess) {
            set(state => { state.xp += 100; });
            get().nextTask();
          } else {
            get().loseLife();
          }
        }

        set({ isExecuting: false });
      },

      resetCurrentTask: () => {
        get().initialize(); // Re-inicializa el task actual
      },

      nextTask: () => {
        const { tasks, currentTask } = get();
        if (currentTask < tasks.length - 1) {
          get().initialize(currentTask + 1);
        } else {
          console.log("¡Juego completado!");
          // Aquí se podría mostrar un modal o redirigir
        }
      },

      loseLife: () => {
        set(state => {
          state.lives -= 1;
        });
        if (get().lives > 0) {
          get().resetCurrentTask();
        } else {
          console.log("Game Over");
          // Lógica de Game Over
        }
      },

      initializeGame: () => {
        if (typeof window !== 'undefined') {
          get().initialize(0);
        }
      },

      hideInstructions: () => {
        set(state => {
          state.showInstructions = false;
        });
      },

      hideFeedback: () => {
        set(state => {
          state.feedback = null;
        });
      },
    })),
    {
      name: 'steam-v2-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTask: state.currentTask,
        lives: state.lives,
        xp: state.xp,
      }),
    }
  )
);

export default useSteamStore;
