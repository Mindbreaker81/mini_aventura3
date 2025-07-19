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
  name: string;
  maxBlocks: number;
  board: {
    start: [number, number];
    goal: [number, number];
    walls: [number, number][];
  };
  hint: string;
}

interface SteamState {
  tasks: SteamTask[];
  currentTask: number;
  robot: RobotState;
  lives: number;
  xp: number;
  isExecuting: boolean;
  hasCrashed: boolean;
  robotPath: [number, number][]; // Rastro del camino del robot
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
      lives: 3,
      xp: 0,
      isExecuting: false,
      hasCrashed: false,
      robotPath: [], // Inicialmente vacío
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
            state.robot = { 
              x: task.board.start[0], 
              y: task.board.start[1], 
              dir: 'E' 
            };
            state.robotPath = []; // Resetear el camino al iniciar un nuevo task
          });
        }
      },
      
      setBlocklyCode: (code) => set({ blocklyCode: code }),

      executeCode: async (code) => {
        set({ isExecuting: true, hasCrashed: false, robotPath: [] }); // Resetear el camino al empezar

        const { tasks, currentTask } = get();
        const task = tasks[currentTask];
        if (!task) {
          set({ isExecuting: false });
          return;
        }

        let tempRobot = { ...get().robot };
        let hasCrashed = false;
        let robotPath: [number, number][] = []; // Camino temporal

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        // --- API de funciones para el código de Blockly ---
        const api = {
          move: async (steps: number = 1) => {
            if (hasCrashed) return;
            
            // Mover paso a paso, mostrando cada movimiento
            for (let step = 0; step < steps; step++) {
              // Calcular la nueva posición para este paso
              let newX = tempRobot.x, newY = tempRobot.y;
              if (tempRobot.dir === 'N') newY--;
              if (tempRobot.dir === 'S') newY++;
              if (tempRobot.dir === 'W') newX--;
              if (tempRobot.dir === 'E') newX++;

              // Verificar límites del tablero (6x6)
              if (newX < 0 || newX >= 6 || newY < 0 || newY >= 6) {
                hasCrashed = true;
                set({ hasCrashed: true });
                await delay(1000); // Pausa para mostrar el crash
                return;
              }

              // Verificar colisión con muros
              if (task.board.walls.some(([wallX, wallY]) => wallX === newX && wallY === newY)) {
                hasCrashed = true;
                set({ hasCrashed: true });
                await delay(1000); // Pausa para mostrar el crash
                return;
              }
              
              // Actualizar la posición del robot paso a paso
              tempRobot = { ...tempRobot, x: newX, y: newY };
              
              // Agregar la nueva posición al camino
              robotPath.push([newX, newY]);
              
              // Actualizar el estado con el robot y el camino
              set({ robot: { ...tempRobot }, robotPath: [...robotPath] });
              
              // Pausa para mostrar el movimiento
              await delay(1500); // Animación mucho más lenta para ver claramente cada movimiento
            }
          },
          turnLeft: async () => {
            if (hasCrashed) return;
            const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'W', 'S', 'E'];
            tempRobot.dir = dirs[(dirs.indexOf(tempRobot.dir) + 1) % 4];
            set({ robot: { ...tempRobot } });
            await delay(1200); // Animación más lenta para giros
          },
          turnRight: async () => {
            if (hasCrashed) return;
            const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W'];
            tempRobot.dir = dirs[(dirs.indexOf(tempRobot.dir) + 1) % 4];
            set({ robot: { ...tempRobot } });
            await delay(1200); // Animación más lenta para giros
          },
        };

        // --- Ejecución segura del código ---
        try {
          const func = new Function('move', 'turnLeft', 'turnRight', `return (async () => { ${code} })();`);
          await func(api.move, api.turnLeft, api.turnRight);
        } catch (error) {
          console.error("Error ejecutando código de Blockly:", error);
          hasCrashed = true;
          set({ hasCrashed: true });
        }

        // --- Verificación final ---
        if (hasCrashed) {
          await delay(2000); // Pausa más larga para mostrar el crash
          set(state => {
            state.feedback = {
              show: true,
              type: 'error',
              message: '¡El robot ha chocado! Intenta de nuevo.'
            };
          });
          get().loseLife();
        } else {
          const [goalX, goalY] = task.board.goal;
          const isSuccess = tempRobot.x === goalX && tempRobot.y === goalY;
          
          if (isSuccess) {
            await delay(1500); // Pausa más larga para celebrar el éxito
            set(state => { 
              state.xp += 100;
              state.feedback = {
                show: true,
                type: 'success',
                message: '¡Excelente! Has completado el nivel.'
              };
            });
            get().nextTask();
          } else {
            await delay(1500); // Pausa más larga para mostrar el error
            set(state => {
              state.feedback = {
                show: true,
                type: 'error',
                message: '¡No has llegado a la meta! Intenta de nuevo.'
              };
            });
            get().loseLife();
          }
        }

        set({ isExecuting: false, hasCrashed: false });
      },

      resetCurrentTask: () => {
        get().initialize(); // Re-inicializa el task actual
        set({ robotPath: [] }); // Limpiar el camino
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
