import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, RobotState, SteamTask, BOARD_SIZE, DIRECTION_VECTORS } from './types';
import steamTasks from '../../data/steam-tasks.json';

interface DesafioSteamStore extends GameState {
  initializeGame: () => void;
  showInstructionsScreen: () => void;
  hideInstructionsScreen: () => void;
  resetRobot: () => void;
  executeCommands: (commands: string[]) => Promise<void>;
  turnRobot: (direction: 'left' | 'right') => void;
  moveRobot: () => boolean;
  checkGoalReached: () => boolean;
  nextTask: () => void;
  resetTask: () => void;
  awardXP: (amount: number) => void;
  showFeedback: (success: boolean, message: string) => void;
  hideFeedback: () => void;
  setBlocklyCode: (code: string) => void;
}

const initialRobotState: RobotState = {
  position: { x: 0, y: 0 },
  direction: 'east',
  isMoving: false,
  hasCollided: false,
  hasReachedGoal: false,
};

const useDesafioSteamStore = create<DesafioSteamStore>()(
  persist(
    (set, get) => ({
      currentTask: 0,
      completedLEDs: 0,
      lives: 3,
      xp: 0,
      tasks: steamTasks as SteamTask[],
      robotState: { ...initialRobotState },
      isExecuting: false,
      blocklyCode: '',
      feedback: null,
      gameStatus: 'instructions',
      badge: false,
      showInstructions: true,

      initializeGame: () => {
        const tasks = steamTasks as SteamTask[];
        const firstTask = tasks[0];
        
        set({
          currentTask: 0,
          completedLEDs: 0,
          lives: 3,
          xp: 0,
          tasks,
          robotState: {
            ...initialRobotState,
            position: { x: firstTask.board.start[0], y: firstTask.board.start[1] },
          },
          isExecuting: false,
          blocklyCode: '',
          feedback: null,
          gameStatus: 'playing',
          badge: false,
        });
      },

      showInstructionsScreen: () => {
        set({ showInstructions: true, gameStatus: 'instructions' });
      },

      hideInstructionsScreen: () => {
        set({ showInstructions: false, gameStatus: 'playing' });
      },

      resetRobot: () => {
        const { tasks, currentTask } = get();
        const task = tasks[currentTask];
        
        set({
          robotState: {
            ...initialRobotState,
            position: { x: task.board.start[0], y: task.board.start[1] },
          },
          isExecuting: false,
        });
      },

      executeCommands: async (commands: string[]) => {
        set({ isExecuting: true });
        
        for (const command of commands) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre comandos
          
          if (command === 'move') {
            const moved = get().moveRobot();
            if (!moved) {
              // Colisión - reducir vidas
              const { lives } = get();
              const newLives = lives - 1;
              
              set(state => ({
                lives: newLives,
                robotState: { ...state.robotState, hasCollided: true }
              }));
              
              if (newLives <= 0) {
                get().showFeedback(false, '¡Se acabaron las vidas! Reinicia el nivel.');
                set({ gameStatus: 'failed' });
                break;
              } else {
                get().showFeedback(false, `¡Colisión! Te quedan ${newLives} vidas.`);
                get().resetRobot();
                break;
              }
            }
          } else if (command === 'turnLeft') {
            get().turnRobot('left');
          } else if (command === 'turnRight') {
            get().turnRobot('right');
          }
          
          // Verificar si llegó a la meta
          if (get().checkGoalReached()) {
            get().awardXP(10);
            get().showFeedback(true, '¡Excelente! Robot llegó a la meta.');
            
            const { currentTask, tasks } = get();
            if (currentTask < tasks.length - 1) {
              setTimeout(() => {
                get().nextTask();
              }, 2000);
            } else {
              set({ gameStatus: 'completed', badge: true });
              get().awardXP(50); // Bonus por completar todo
            }
            break;
          }
        }
        
        set({ isExecuting: false });
      },

      turnRobot: (direction: 'left' | 'right') => {
        set(state => {
          const directions: Array<'north' | 'east' | 'south' | 'west'> = ['north', 'east', 'south', 'west'];
          const currentIndex = directions.indexOf(state.robotState.direction);
          
          let newIndex;
          if (direction === 'left') {
            newIndex = (currentIndex + 3) % 4; // Girar a la izquierda
          } else {
            newIndex = (currentIndex + 1) % 4; // Girar a la derecha
          }
          
          return {
            robotState: {
              ...state.robotState,
              direction: directions[newIndex],
            },
          };
        });
      },

      moveRobot: () => {
        const { robotState, tasks, currentTask } = get();
        const task = tasks[currentTask];
        const vector = DIRECTION_VECTORS[robotState.direction];
        
        const newX = robotState.position.x + vector.x;
        const newY = robotState.position.y + vector.y;
        
        // Verificar límites del tablero
        if (newX < 0 || newX >= BOARD_SIZE || newY < 0 || newY >= BOARD_SIZE) {
          return false; // Colisión con borde
        }
        
        // Verificar colisión con muros
        const isWall = task.board.walls.some(([wallX, wallY]) => wallX === newX && wallY === newY);
        if (isWall) {
          return false; // Colisión con muro
        }
        
        // Mover robot
        set(state => ({
          robotState: {
            ...state.robotState,
            position: { x: newX, y: newY },
          },
        }));
        
        return true; // Movimiento exitoso
      },

      checkGoalReached: () => {
        const { robotState, tasks, currentTask } = get();
        const task = tasks[currentTask];
        
        return (
          robotState.position.x === task.board.goal[0] &&
          robotState.position.y === task.board.goal[1]
        );
      },

      nextTask: () => {
        const { currentTask, tasks, completedLEDs } = get();
        const newTask = currentTask + 1;
        const newCompletedLEDs = completedLEDs + 1;
        
        if (newTask < tasks.length) {
          const task = tasks[newTask];
          set({
            currentTask: newTask,
            completedLEDs: newCompletedLEDs,
            robotState: {
              ...initialRobotState,
              position: { x: task.board.start[0], y: task.board.start[1] },
            },
            blocklyCode: '',
            feedback: null,
          });
        }
      },

      resetTask: () => {
        get().resetRobot();
        set({
          blocklyCode: '',
          feedback: null,
          lives: 3,
        });
      },

      awardXP: (amount: number) => {
        set(state => ({
          xp: state.xp + amount,
        }));
      },

      showFeedback: (success: boolean, message: string) => {
        set({
          feedback: {
            show: true,
            success,
            message,
          },
        });
      },

      hideFeedback: () => {
        set({ feedback: null });
      },

      setBlocklyCode: (code: string) => {
        set({ blocklyCode: code });
      },
    }),
    {
      name: 'desafio-steam-storage',
      partialize: (state) => ({
        xp: state.xp,
        completedLEDs: state.completedLEDs,
        currentTask: state.currentTask,
        badge: state.badge,
      }),
    }
  )
);

export default useDesafioSteamStore;