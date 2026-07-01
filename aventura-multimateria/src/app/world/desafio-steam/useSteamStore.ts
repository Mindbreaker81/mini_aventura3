'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import steamTasksData from '../../data/steam-tasks.json';
import type { GameStatus } from '../shared/types';

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
  robotPath: [number, number][];
  blocklyCode: string;
  showInstructions: boolean;
  gameStatus: GameStatus;
  gameCompleted: boolean;
  pendingAdvance: boolean;
  feedback: { show: boolean; type: 'success' | 'error'; message: string } | null;
  badge: { name: string } | null;

  initialize: (taskId?: number) => void;
  resetAdventure: () => void;
  setBlocklyCode: (code: string) => void;
  executeCode: (code: string) => Promise<void>;
  resetCurrentTask: () => void;
  nextTask: () => void;
  loseLife: () => void;
  hideInstructions: () => void;
  hideFeedback: () => void;
}

const STEAM_BADGE = { name: 'Ingeniero Junior' };

const useSteamStore = create<SteamState>()(
  persist(
    immer((set, get) => ({
      tasks: steamTasksData as SteamTask[],
      currentTask: 0,
      robot: { x: 0, y: 0, dir: 'E' },
      lives: 3,
      xp: 0,
      isExecuting: false,
      hasCrashed: false,
      robotPath: [],
      blocklyCode: '',
      showInstructions: true,
      gameStatus: 'instructions',
      gameCompleted: false,
      pendingAdvance: false,
      feedback: null,
      badge: null,

      initialize: (taskId) => {
        const { tasks } = get();
        const taskIndex = taskId ?? get().currentTask;
        const task = tasks[taskIndex];

        if (task) {
          set((state) => {
            state.currentTask = taskIndex;
            state.robot = {
              x: task.board.start[0],
              y: task.board.start[1],
              dir: 'E',
            };
            state.robotPath = [];
          });
        }
      },

      resetAdventure: () => {
        set((state) => {
          state.currentTask = 0;
          state.lives = 3;
          state.xp = 0;
          state.gameCompleted = false;
          state.gameStatus = 'playing';
          state.showInstructions = false;
          state.badge = null;
          state.pendingAdvance = false;
          state.feedback = null;
          state.robotPath = [];
        });
        get().initialize(0);
      },

      setBlocklyCode: (code) => set({ blocklyCode: code }),

      executeCode: async (code) => {
        set({ isExecuting: true, hasCrashed: false, robotPath: [] });

        const { tasks, currentTask } = get();
        const task = tasks[currentTask];
        if (!task) {
          set({ isExecuting: false });
          return;
        }

        let tempRobot = { ...get().robot };
        let hasCrashed = false;
        const robotPath: [number, number][] = [];

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        const api = {
          move: async (steps: number = 1) => {
            if (hasCrashed) return;

            for (let step = 0; step < steps; step++) {
              let newX = tempRobot.x;
              let newY = tempRobot.y;
              if (tempRobot.dir === 'N') newY--;
              if (tempRobot.dir === 'S') newY++;
              if (tempRobot.dir === 'W') newX--;
              if (tempRobot.dir === 'E') newX++;

              if (newX < 0 || newX >= 6 || newY < 0 || newY >= 6) {
                hasCrashed = true;
                set({ hasCrashed: true });
                await delay(1000);
                return;
              }

              if (task.board.walls.some(([wallX, wallY]) => wallX === newX && wallY === newY)) {
                hasCrashed = true;
                set({ hasCrashed: true });
                await delay(1000);
                return;
              }

              tempRobot = { ...tempRobot, x: newX, y: newY };
              robotPath.push([newX, newY]);
              set({ robot: { ...tempRobot }, robotPath: [...robotPath] });
              await delay(1500);
            }
          },
          turnLeft: async () => {
            if (hasCrashed) return;
            const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'W', 'S', 'E'];
            tempRobot.dir = dirs[(dirs.indexOf(tempRobot.dir) + 1) % 4];
            set({ robot: { ...tempRobot } });
            await delay(1200);
          },
          turnRight: async () => {
            if (hasCrashed) return;
            const dirs: ('N' | 'E' | 'S' | 'W')[] = ['N', 'E', 'S', 'W'];
            tempRobot.dir = dirs[(dirs.indexOf(tempRobot.dir) + 1) % 4];
            set({ robot: { ...tempRobot } });
            await delay(1200);
          },
        };

        try {
          const func = new Function(
            'move',
            'turnLeft',
            'turnRight',
            `return (async () => { ${code} })();`
          );
          await func(api.move, api.turnLeft, api.turnRight);
        } catch (error) {
          console.error('Error ejecutando código de Blockly:', error);
          hasCrashed = true;
          set({ hasCrashed: true });
        }

        if (hasCrashed) {
          await delay(2000);
          set((state) => {
            state.feedback = {
              show: true,
              type: 'error',
              message: 'steam.feedback.crashed',
            };
          });
          get().loseLife();
        } else {
          const [goalX, goalY] = task.board.goal;
          const isSuccess = tempRobot.x === goalX && tempRobot.y === goalY;

          if (isSuccess) {
            await delay(1500);
            set((state) => {
              state.xp += 100;
              state.feedback = {
                show: true,
                type: 'success',
                message: 'steam.feedback.levelComplete',
              };
              state.pendingAdvance = true;
            });
          } else {
            await delay(1500);
            set((state) => {
              state.feedback = {
                show: true,
                type: 'error',
                message: 'steam.feedback.missedGoal',
              };
            });
            get().loseLife();
          }
        }

        set({ isExecuting: false, hasCrashed: false });
      },

      resetCurrentTask: () => {
        get().initialize();
        set({ robotPath: [] });
      },

      nextTask: () => {
        const { tasks, currentTask } = get();
        if (currentTask < tasks.length - 1) {
          set((state) => {
            state.currentTask = currentTask + 1;
            state.lives = 3;
          });
          get().initialize(currentTask + 1);
        } else {
          set((state) => {
            state.gameCompleted = true;
            state.gameStatus = 'completed';
            state.badge = STEAM_BADGE;
          });
        }
      },

      loseLife: () => {
        set((state) => {
          state.lives -= 1;
        });
        if (get().lives > 0) {
          get().resetCurrentTask();
        } else {
          set((state) => {
            state.gameStatus = 'failed';
          });
        }
      },

      hideInstructions: () => {
        set((state) => {
          state.showInstructions = false;
          state.gameStatus = 'playing';
        });
        get().initialize(0);
      },

      hideFeedback: () => {
        const pending = get().pendingAdvance;
        set((state) => {
          state.feedback = null;
          state.pendingAdvance = false;
        });
        if (pending) {
          get().nextTask();
        }
      },
    })),
    {
      name: 'steam-v2-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTask: state.currentTask,
        lives: state.lives,
        xp: state.xp,
        gameStatus: state.gameStatus,
        gameCompleted: state.gameCompleted,
        showInstructions: state.showInstructions,
        badge: state.badge,
      }),
    }
  )
);

export default useSteamStore;
