'use client';
import React from 'react';
import useSteamStore from './useSteamStore';

const RobotBoard: React.FC = () => {
  const { tasks, currentTask, robot } = useSteamStore();
  
  const currentBoard = tasks[currentTask]?.board;
  if (!currentBoard) return null;

  const { start, goal, walls } = currentBoard;

  // Función para obtener el emoji del robot según su dirección
  const getRobotEmoji = (direction: number) => {
    const directions = ['⬆️', '➡️', '⬇️', '⬅️'];
    return directions[direction];
  };

  // Función para determinar el tipo de celda
  const getCellContent = (x: number, y: number) => {
    // Posición del robot
    if (robot.position.x === x && robot.position.y === y) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-2xl">{getRobotEmoji(robot.direction)}</span>
        </div>
      );
    }
    
    // Posición de inicio
    if (start[0] === x && start[1] === y) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-2xl">🏁</span>
        </div>
      );
    }
    
    // Posición de meta
    if (goal[0] === x && goal[1] === y) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-2xl">🎯</span>
        </div>
      );
    }
    
    // Muros
    if (walls.some(([wallX, wallY]) => wallX === x && wallY === y)) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-800">
          <span className="text-2xl">🧱</span>
        </div>
      );
    }
    
    // Celda vacía
    return null;
  };

  // Función para obtener las clases CSS de cada celda
  const getCellClasses = (x: number, y: number) => {
    let baseClasses = "w-16 h-16 border-2 border-gray-300 flex items-center justify-center relative";
    
    // Robot
    if (robot.position.x === x && robot.position.y === y) {
      if (robot.crashed) {
        baseClasses += " bg-red-200 animate-pulse";
      } else if (robot.reached) {
        baseClasses += " bg-green-200";
      } else {
        baseClasses += " bg-blue-200";
      }
    }
    // Inicio
    else if (start[0] === x && start[1] === y) {
      baseClasses += " bg-green-100";
    }
    // Meta
    else if (goal[0] === x && goal[1] === y) {
      baseClasses += " bg-yellow-100";
    }
    // Muro
    else if (walls.some(([wallX, wallY]) => wallX === x && wallY === y)) {
      baseClasses += " bg-gray-800";
    }
    // Celda normal
    else {
      baseClasses += " bg-white hover:bg-gray-50";
    }
    
    return baseClasses;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Nivel {currentTask + 1}: {tasks[currentTask]?.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          💡 {tasks[currentTask]?.hint}
        </p>
        <p className="text-sm text-gray-500">
          Máximo bloques: {tasks[currentTask]?.maxBlocks}
        </p>
      </div>
      
      {/* Tablero 6x6 */}
      <div className="grid grid-cols-6 gap-1 bg-gray-200 p-4 rounded-lg max-w-fit mx-auto">
        {Array.from({ length: 6 }, (_, y) =>
          Array.from({ length: 6 }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClasses(x, y)}
            >
              {getCellContent(x, y)}
              {/* Coordenadas para debug */}
              <span className="absolute top-0 left-0 text-xs text-gray-400 opacity-50">
                {x},{y}
              </span>
            </div>
          ))
        )}
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span>🏁</span>
          <span>Inicio</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🎯</span>
          <span>Meta</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🧱</span>
          <span>Muro</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <span>Robot</span>
        </div>
      </div>
    </div>
  );
};

export default RobotBoard;