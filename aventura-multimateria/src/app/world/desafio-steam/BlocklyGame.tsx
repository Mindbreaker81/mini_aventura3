"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import useDesafioSteamStore from './useDesafioSteamStore';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Importar Blockly
declare global {
  interface Window {
    Blockly: any;
  }
}

const BlocklyGame: React.FC = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  
  const { 
    executeCommands, 
    resetTask, 
    setBlocklyCode, 
    tasks, 
    currentTask, 
    isExecuting,
    lives,
    xp,
    completedLEDs
  } = useDesafioSteamStore();

  useEffect(() => {
    if (!blocklyDiv.current) {
      console.log("El div de Blockly aún no está montado");
      return;
    }
    console.log("Inicializando Blockly...");
    // Definir bloques personalizados SIEMPRE antes de crear el workspace
    if (!Blockly.Blocks['move_forward']) {
      Blockly.Blocks['move_forward'] = {
        init: function() {
          this.appendDummyInput().appendField('avanzar');
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(120);
          this.setTooltip('Mueve el robot hacia adelante');
        }
      };
      javascriptGenerator.forBlock['move_forward'] = function() {
        return 'moveForward();\n';
      };
    }
    if (!Blockly.Blocks['turn_left']) {
      Blockly.Blocks['turn_left'] = {
        init: function() {
          this.appendDummyInput().appendField('girar izquierda');
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160);
          this.setTooltip('Gira el robot hacia la izquierda');
        }
      };
      javascriptGenerator.forBlock['turn_left'] = function() {
        return 'turnLeft();\n';
      };
    }
    if (!Blockly.Blocks['turn_right']) {
      Blockly.Blocks['turn_right'] = {
        init: function() {
          this.appendDummyInput().appendField('girar derecha');
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(200);
          this.setTooltip('Gira el robot hacia la derecha');
        }
      };
      javascriptGenerator.forBlock['turn_right'] = function() {
        return 'turnRight();\n';
      };
    }
    // Definir toolbox
    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Movimiento',
          colour: '#4CAF50',
          contents: [
            { kind: 'block', type: 'move_forward' },
            { kind: 'block', type: 'turn_left' },
            { kind: 'block', type: 'turn_right' }
          ]
        },
        {
          kind: 'category',
          name: 'Bucles',
          colour: '#FF9800',
          contents: [
            {
              kind: 'block',
              type: 'controls_repeat_ext',
              inputs: {
                TIMES: {
                  block: {
                    type: 'math_number',
                    fields: { NUM: 3 }
                  }
                }
              }
            }
          ]
        }
      ]
    };
    // Limpiar workspace anterior si existe
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }
    // Crear workspace
    console.log("Inyectando Blockly en el div", blocklyDiv.current);
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });
    workspaceRef.current = workspace;
    setBlocklyLoaded(true);
    console.log("Blockly cargado y workspace creado");
    // Listener para cambios en el workspace
    workspace.addChangeListener(() => {
      const code = javascriptGenerator.workspaceToCode(workspace);
      setBlocklyCode(code);
    });
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [blocklyDiv.current]);

  const executeCode = () => {
    if (!workspaceRef.current) return;

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    const commands = parseCodeToCommands(code);
    
    if (commands.length === 0) {
      alert('¡Agrega algunos bloques para programar el robot!');
      return;
    }

    const maxBlocks = tasks[currentTask].maxBlocks;
    const blockCount = countBlocks();
    
    if (blockCount > maxBlocks) {
      alert(`¡Usa máximo ${maxBlocks} bloques! Actualmente usas ${blockCount}.`);
      return;
    }

    executeCommands(commands);
  };

  const parseCodeToCommands = (code: string): string[] => {
    const commands: string[] = [];
    
    // Simular funciones para capturar comandos
    const moveForward = () => commands.push('move');
    const turnLeft = () => commands.push('turnLeft');
    const turnRight = () => commands.push('turnRight');
    
    try {
      // Evaluar el código generado
      eval(code);
    } catch (error) {
      console.error('Error executing code:', error);
    }
    
    return commands;
  };

  const countBlocks = (): number => {
    if (!workspaceRef.current) return 0;
    return workspaceRef.current.getAllBlocks().length;
  };

  const resetCode = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
    }
    resetTask();
  };

  if (!blocklyLoaded) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando editor de bloques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Editor de Bloques</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              <span>{xp} XP</span>
            </div>
            <div>💖 {lives} vidas</div>
            <div>💡 {completedLEDs}/6 completados</div>
          </div>
        </div>
      </div>

      {/* Área de Blockly */}
      <div className="relative">
        <div style={{ width: '100%', height: '400px' }} ref={blocklyDiv} />
      </div>

      {/* Controles */}
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Bloques usados: <span className="font-semibold">{countBlocks()}</span> / {tasks[currentTask].maxBlocks}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>
          
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={16} />
            {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlocklyGame;