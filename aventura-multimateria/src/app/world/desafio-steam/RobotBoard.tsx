"use client";
import React from 'react';
import { Bot } from 'lucide-react';
import { BOARD_SIZE, DIRECTION_ANGLES } from './types';
import useDesafioSteamStore from './useDesafioSteamStore';

const RobotBoard: React.FC = () => {
  const { robotState, tasks, currentTask } = useDesafioSteamStore();
  const task = tasks[currentTask];

  const renderCell = (x: number, y: number) => {
    const isRobot = robotState.position.x === x && robotState.position.y === y;
    const isStart = task.board.start[0] === x && task.board.start[1] === y;
    const isGoal = task.board.goal[0] === x && task.board.goal[1] === y;
    const isWall = task.board.walls.some(([wallX, wallY]) => wallX === x && wallY === y);

    // Células responsivas: más pequeñas en móviles, más grandes en desktop
    let cellClass = "w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 border border-gray-300 flex items-center justify-center relative transition-all duration-200";
    
    if (isWall) {
      cellClass += " bg-gray-800";
    } else if (isGoal) {
      cellClass += " bg-yellow-300 shadow-inner";
    } else if (isStart && !isRobot) {
      cellClass += " bg-green-200";
    } else {
      cellClass += " bg-white hover:bg-gray-50";
    }

    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {isRobot && (
          <Bot 
            className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-600 transition-all duration-300"
            style={{
              transform: `rotate(${DIRECTION_ANGLES[robotState.direction]}deg)`
            }}
          />
        )}
        {isGoal && !isRobot && (
          <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-yellow-500 rounded-full border-2 border-yellow-600 animate-pulse"></div>
        )}
        {isStart && !isRobot && !isGoal && (
          <div className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full"></div>
        )}
        {isWall && (
          <div className="w-full h-full bg-gray-900 rounded-sm shadow-inner"></div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        board.push(renderCell(x, y));
      }
    }
    return board;
  };

  return (
    <div className="bg-white rounded-lg p-2 sm:p-4 shadow-lg w-full">
      <div className="mb-2 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
          Desafío {currentTask + 1}: {task.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          💡 {task.hint}
        </p>
        
        {/* Leyenda responsive */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="truncate">Inicio</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
            <span className="truncate">Meta</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-800 rounded-sm flex-shrink-0"></div>
            <span className="truncate">Muro</span>
          </span>
          <span className="flex items-center gap-1">
            <Bot size={12} className="sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
            <span className="truncate">Robot</span>
          </span>
        </div>
      </div>
      
      {/* Tablero responsivo */}
      <div className="flex justify-center mb-2 sm:mb-4">
        <div 
          className="grid grid-cols-6 gap-0.5 sm:gap-1 border-2 border-gray-400 p-1 sm:p-2 rounded-lg bg-gray-100 max-w-full"
        >
          {renderBoard()}
        </div>
      </div>
      
      <div className="text-center text-xs sm:text-sm text-gray-600">
        <span className="font-semibold">Máximo {task.maxBlocks} bloques</span>
      </div>
    </div>
  );
};

export default RobotBoard;