'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, RobotState, SteamTask, Badge } from './types';
import steamTasksData from '../../data/steam-tasks.json';

interface SteamStore extends GameState {
  // State
  tasks: SteamTask[];
  robot: RobotState;
  feedback: {
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  } | null;
  badge: Badge | null;

  // Actions
  initializeGame: () => void;
  setBlocklyCode: (code: string) => void;
  executeCode: (commands: string[]) => Promise<void>;
  resetCurrentTask: () => void;
  nextTask: () => void;
  hideInstructions: () => void;
  hideFeedback: () => void;
  moveRobot: () => Promise<boolean>;
  turnRobotLeft: () => void;
  turnRobotRight: () => void;
  checkCollision: (x: number, y: number) => boolean;
  checkGoal: (x: number, y: number) => boolean;
  onTaskComplete: () => void;
  onTaskFail: () => void;
}

const initialRobotState = (): RobotState => ({
  position: { x: 0, y: 0 },
  direction: 1, // Este
  crashed: false,
  reached: false,
});

const useSteamStore = create<SteamStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: steamTasksData as SteamTask[],
      currentTask: 0,
      lives: 3,
      leds: 0,
      xp: 0,
      blocklyCode: '',
      isExecuting: false,
      showInstructions: true,
      gameCompleted: false,
      robot: initialRobotState(),
      feedback: null,
      badge: null,

      // Actions
      initializeGame: () => {
        const state = get();
        const currentBoard = state.tasks[state.currentTask].board;
        set({
          robot: {
            position: { x: currentBoard.start[0], y: currentBoard.start[1] },
            direction: 1, // Este por defecto
            crashed: false,
            reached: false,
          },
          lives: 3,
          isExecuting: false,
        });
      },

      setBlocklyCode: (code: string) => {
        set({ blocklyCode: code });
        // Guardar en localStorage para persistencia
        if (typeof window !== 'undefined') {
          localStorage.setItem('steam-session', code);
        }
      },

      executeCode: async (commands: string[]) => {
        set({ isExecuting: true });
        const state = get();
        
        try {
          for (const command of commands) {
            if (state.robot.crashed || state.robot.reached) break;
            
            if (command === 'move(1)') {
              const success = await get().moveRobot();
              if (!success) break;
            } else if (command === 'turnLeft()') {
              get().turnRobotLeft();
            } else if (command === 'turnRight()') {
              get().turnRobotRight();
            }
            
            // Pausa para animación
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error('Error executing code:', error);
        } finally {
          set({ isExecuting: false });
        }
      },

      resetCurrentTask: () => {
        const state = get();
        const currentBoard = state.tasks[state.currentTask].board;
        set({
          robot: {
            position: { x: currentBoard.start[0], y: currentBoard.start[1] },
            direction: 1,
            crashed: false,
            reached: false,
          },
          isExecuting: false,
        });
      },

      nextTask: () => {
        const state = get();
        if (state.currentTask < state.tasks.length - 1) {
          const nextTaskIndex = state.currentTask + 1;
          const nextBoard = state.tasks[nextTaskIndex].board;
          set({
            currentTask: nextTaskIndex,
            robot: {
              position: { x: nextBoard.start[0], y: nextBoard.start[1] },
              direction: 1,
              crashed: false,
              reached: false,
            },
            lives: 3,
          });
        } else {
          // Juego completado
          set({
            gameCompleted: true,
            badge: {
              id: 'ingeniero_junior',
              name: 'Ingeniero Junior'
            }
          });
        }
      },

      hideInstructions: () => {
        set({ showInstructions: false });
      },

      hideFeedback: () => {
        set({ feedback: null });
      },

      moveRobot: async (): Promise<boolean> => {
        const state = get();
        const { robot } = state;
        const directions = [
          { x: 0, y: -1 }, // Norte
          { x: 1, y: 0 },  // Este
          { x: 0, y: 1 },  // Sur
          { x: -1, y: 0 }  // Oeste
        ];
        
        const direction = directions[robot.direction];
        const newX = robot.position.x + direction.x;
        const newY = robot.position.y + direction.y;

        // Verificar límites del tablero
        if (newX < 0 || newX > 5 || newY < 0 || newY > 5) {
          set({
            robot: { ...robot, crashed: true },
            feedback: {
              message: '¡El robot se salió del tablero!',
              type: 'error',
              show: true
            }
          });
          get().onTaskFail();
          return false;
        }

        // Verificar colisiones con muros
        if (get().checkCollision(newX, newY)) {
          set({
            robot: { ...robot, crashed: true },
            feedback: {
              message: '¡El robot chocó con un muro!',
              type: 'error',
              show: true
            }
          });
          get().onTaskFail();
          return false;
        }

        // Mover robot
        set({
          robot: {
            ...robot,
            position: { x: newX, y: newY }
          }
        });

        // Verificar si llegó a la meta
        if (get().checkGoal(newX, newY)) {
          set({
            robot: { ...get().robot, reached: true },
            feedback: {
              message: '¡Excelente! Robot llegó a la meta.',
              type: 'success',
              show: true
            }
          });
          get().onTaskComplete();
          return false; // Detener ejecución
        }

        return true;
      },

      turnRobotLeft: () => {
        const state = get();
        set({
          robot: {
            ...state.robot,
            direction: (state.robot.direction + 3) % 4 // Girar izquierda
          }
        });
      },

      turnRobotRight: () => {
        const state = get();
        set({
          robot: {
            ...state.robot,
            direction: (state.robot.direction + 1) % 4 // Girar derecha
          }
        });
      },

      checkCollision: (x: number, y: number): boolean => {
        const state = get();
        const walls = state.tasks[state.currentTask].board.walls;
        return walls.some(([wallX, wallY]) => wallX === x && wallY === y);
      },

      checkGoal: (x: number, y: number): boolean => {
        const state = get();
        const goal = state.tasks[state.currentTask].board.goal;
        return goal[0] === x && goal[1] === y;
      },

      onTaskComplete: () => {
        const state = get();
        const newLeds = state.leds + 1;
        const newXP = state.xp + 20;

        set({
          leds: newLeds,
          xp: newXP
        });

        // Verificar si completó todos los niveles
        if (newLeds === 6) {
          set({
            xp: newXP + 120, // Bonus
            gameCompleted: true,
            badge: {
              id: 'ingeniero_junior',
              name: 'Ingeniero Junior'
            },
            feedback: {
              message: '¡Felicitaciones! Has completado todos los desafíos.',
              type: 'success',
              show: true
            }
          });
        } else {
          // Siguiente tarea después de un delay
          setTimeout(() => {
            get().nextTask();
          }, 2000);
        }
      },

      onTaskFail: () => {
        const state = get();
        const newLives = state.lives - 1;
        
        set({ lives: newLives });

        if (newLives <= 0) {
          set({
            feedback: {
              message: 'Sin vidas restantes. Reiniciando nivel...',
              type: 'error',
              show: true
            },
            lives: 3
          });
          setTimeout(() => {
            get().resetCurrentTask();
          }, 2000);
        }
      },
    }),
    {
      name: 'steam-v2-storage',
      version: 1,
    }
  )
);

export default useSteamStore;