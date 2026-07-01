'use client';
import React from 'react';
import { useTranslation } from '../../components/I18nProvider';
import useSteamStore from './useSteamStore';

const RobotBoard: React.FC = () => {
  const { t } = useTranslation('common');
  const { tasks, currentTask, robot, isExecuting, hasCrashed, robotPath } = useSteamStore();
  
  if (!tasks || !tasks[currentTask] || !robot) return null;

  const task = tasks[currentTask];
  const { start, goal, walls } = task.board;

  // Función para obtener el emoji del robot según su dirección
  const getRobotEmoji = (direction: string) => {
    const directions = { 'N': '⬆️', 'E': '➡️', 'S': '⬇️', 'W': '⬅️' };
    return directions[direction as keyof typeof directions] || '🤖';
  };

  // Función para determinar el tipo de celda
  const getCellContent = (x: number, y: number) => {
    // Posición del robot
    if (robot.x === x && robot.y === y) {
      return (
        <div className={`flex items-center justify-center w-full h-full transition-all duration-200 ${
          isExecuting ? 'animate-pulse' : ''
        }`}>
          <span className={`text-2xl transition-all duration-200 ${
            isExecuting ? 'scale-110' : 'scale-100'
          } ${hasCrashed ? 'animate-bounce text-red-500' : ''}`}>
            {hasCrashed ? '💥' : getRobotEmoji(robot.dir)}
          </span>
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
          <span className={`text-2xl ${isExecuting ? 'animate-bounce' : ''}`}>
            🎯
          </span>
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
    let baseClasses = "w-16 h-16 border-2 border-gray-300 flex items-center justify-center relative transition-all duration-200";
    
    // Robot
    if (robot.x === x && robot.y === y) {
      baseClasses += " bg-blue-200 shadow-lg";
      if (isExecuting) {
        baseClasses += " ring-2 ring-blue-400 ring-opacity-50";
      }
      if (hasCrashed) {
        baseClasses += " bg-red-200 ring-2 ring-red-500 ring-opacity-75";
      }
    }
    // Camino del robot (rastro)
    else if (robotPath.some(([pathX, pathY]) => pathX === x && pathY === y)) {
      baseClasses += " bg-blue-100";
      // Agregar un indicador visual del camino
      baseClasses += " before:content-[''] before:absolute before:inset-1 before:bg-blue-200 before:rounded before:opacity-30";
    }
    // Inicio
    else if (start[0] === x && start[1] === y) {
      baseClasses += " bg-green-100";
    }
    // Meta
    else if (goal[0] === x && goal[1] === y) {
      baseClasses += " bg-yellow-100";
      if (isExecuting) {
        baseClasses += " ring-2 ring-yellow-400 ring-opacity-50";
      }
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
          {t('steam.playing.levelTitle', { level: currentTask + 1, name: task.name })}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          💡 {task.hint}
        </p>
        <p className="text-sm text-gray-500">
          {t('steam.playing.maxBlocks', { count: task.maxBlocks })}
        </p>
        {isExecuting && (
          <div className="mt-2 flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">{t('steam.playing.executingCode')}</span>
          </div>
        )}
        {hasCrashed && (
          <div className="mt-2 flex items-center gap-2 text-red-600">
            <span className="text-lg">💥</span>
            <span className="text-sm font-medium">{t('steam.playing.crashed')}</span>
          </div>
        )}
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