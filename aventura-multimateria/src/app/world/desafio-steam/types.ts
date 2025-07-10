// Types para Desafío STEAM v2

export interface Position {
  x: number;
  y: number;
}

export interface Board {
  start: [number, number];
  goal: [number, number];
  walls: [number, number][];
}

export interface SteamTask {
  id: number;
  name: string;
  maxBlocks: number;
  board: Board;
  hint: string;
}

export interface RobotState {
  position: Position;
  direction: number; // 0=Norte, 1=Este, 2=Sur, 3=Oeste
  crashed: boolean;
  reached: boolean;
}

export interface GameState {
  currentTask: number;
  lives: number;
  leds: number;
  xp: number;
  blocklyCode: string;
  isExecuting: boolean;
  showInstructions: boolean;
  gameCompleted: boolean;
}

export type Direction = 'north' | 'east' | 'south' | 'west';

export interface Badge {
  id: string;
  name: string;
}