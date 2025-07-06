// Tipos para el minijuego Desafío STEAM

export type Direction = "north" | "east" | "south" | "west";

export interface Position {
  x: number;
  y: number;
}

export interface SteamTask {
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

export interface RobotState {
  position: Position;
  direction: Direction;
  isMoving: boolean;
  hasCollided: boolean;
  hasReachedGoal: boolean;
}

export interface GameState {
  currentTask: number;
  completedLEDs: number;
  lives: number;
  xp: number;
  tasks: SteamTask[];
  robotState: RobotState;
  isExecuting: boolean;
  blocklyCode: string;
  feedback: {
    show: boolean;
    success: boolean;
    message: string;
  } | null;
  gameStatus: "instructions" | "playing" | "completed" | "failed";
  badge: boolean;
  showInstructions: boolean;
}

export interface Command {
  action: "move" | "turnLeft" | "turnRight";
  repeat?: number;
}

// Constantes del juego
export const BOARD_SIZE = 6;

export const DIRECTION_VECTORS = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

export const DIRECTION_ANGLES = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
};