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

    let cellClass = "w-12 h-12 border border-gray-300 flex items-center justify-center relative";
    
    if (isWall) {
      cellClass += " bg-gray-800";
    } else if (isGoal) {
      cellClass += " bg-yellow-300";
    } else if (isStart && !isRobot) {
      cellClass += " bg-green-200";
    } else {
      cellClass += " bg-white";
    }

    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {isRobot && (
          <Bot 
            size={32} 
            className="text-blue-600 transition-transform duration-300"
            style={{
              transform: `rotate(${DIRECTION_ANGLES[robotState.direction]}deg)`
            }}
          />
        )}
        {isGoal && !isRobot && (
          <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-yellow-600"></div>
        )}
        {isStart && !isRobot && !isGoal && (
          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
        )}
        {isWall && (
          <div className="w-full h-full bg-gray-900 rounded-sm"></div>
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
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Desafío {currentTask + 1}: {task.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          💡 {task.hint}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Inicio
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            Meta
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
            Muro
          </span>
          <span className="flex items-center gap-1">
            <Bot size={16} className="text-blue-600" />
            Robot
          </span>
        </div>
      </div>
      
      <div 
        className="grid grid-cols-6 gap-1 mx-auto w-fit border-2 border-gray-400 p-2 rounded-lg bg-gray-100"
      >
        {renderBoard()}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Máximo {task.maxBlocks} bloques
      </div>
    </div>
  );
};

export default RobotBoard;