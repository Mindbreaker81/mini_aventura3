"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import useDesafioSteamStore from './useDesafioSteamStore';
import { codeParser } from './codeParser';
import { NotificationContainer, useNotifications } from './NotificationSystem';

// Importación dinámica para evitar problemas SSR
const BlocklyGame: React.FC = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const [Blockly, setBlockly] = useState<any>(null);
  const [javascriptGenerator, setJavascriptGenerator] = useState<any>(null);
  
  // Sistema de notificaciones
  const notifications = useNotifications();
  
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

  // Cargar Blockly solo en el cliente
  useEffect(() => {
    const loadBlockly = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const [blocklyModule, jsGeneratorModule] = await Promise.all([
          import('blockly'),
          import('blockly/javascript')
        ]);
        
        setBlockly(blocklyModule.default);
        setJavascriptGenerator(jsGeneratorModule.javascriptGenerator);
        
        console.log('Blockly loaded successfully');
        notifications.showSuccess('Editor cargado', 'Editor de bloques listo para usar');
      } catch (error) {
        console.error('Error loading Blockly:', error);
        notifications.showError(
          'Error de carga', 
          'No se pudo cargar el editor de bloques',
          {
            label: 'Reintentar',
            onClick: () => window.location.reload()
          }
        );
      }
    };
    
    loadBlockly();
  }, []);

  useEffect(() => {
    if (!blocklyDiv.current || !Blockly || !javascriptGenerator) {
      console.log("Blockly not ready yet");
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
  }, [Blockly, javascriptGenerator, blocklyDiv.current]);

  const executeCode = () => {
    if (!workspaceRef.current || !javascriptGenerator) {
      notifications.showError('Error', 'Editor no está listo');
      return;
    }

    try {
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      const parseResult = codeParser.parseCode(code);
      
      // Verificar errores de parsing
      if (parseResult.errors.length > 0) {
        notifications.showError(
          'Error en el código', 
          parseResult.errors[0]
        );
        return;
      }
      
      if (parseResult.commands.length === 0) {
        notifications.showWarning(
          'Código vacío', 
          '¡Agrega algunos bloques para programar el robot!'
        );
        return;
      }

      // Validar límite de bloques
      const maxBlocks = tasks[currentTask].maxBlocks;
      const blockCount = countBlocks();
      
      if (blockCount > maxBlocks) {
        notifications.showWarning(
          'Demasiados bloques', 
          `Usa máximo ${maxBlocks} bloques. Actualmente usas ${blockCount}.`
        );
        return;
      }

      // Ejecutar comandos seguros
      const commandStrings = parseResult.commands.map(cmd => cmd.action);
      executeCommands(commandStrings);
      
      notifications.showInfo(
        'Ejecutando programa', 
        `${parseResult.totalCommands} comandos en ejecución`
      );
      
    } catch (error) {
      console.error('Error executing code:', error);
      notifications.showError(
        'Error de ejecución', 
        'Hubo un problema al ejecutar el código'
      );
    }
  };

  // Esta función ya no es necesaria - usamos codeParser
  // const parseCodeToCommands = (code: string): string[] => { ... }

  const countBlocks = (): number => {
    if (!workspaceRef.current) return 0;
    return workspaceRef.current.getAllBlocks().length;
  };

  const resetCode = () => {
    try {
      if (workspaceRef.current) {
        workspaceRef.current.clear();
      }
      resetTask();
      notifications.clearAll();
      notifications.showInfo('Reiniciado', 'Código y robot reiniciados');
    } catch (error) {
      console.error('Error resetting:', error);
      notifications.showError('Error', 'No se pudo reiniciar el código');
    }
  };

  // Mostrar loading mientras Blockly se carga
  if (!Blockly || !javascriptGenerator) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando Blockly...</p>
        </div>
      </div>
    );
  }

  if (!blocklyLoaded) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Inicializando editor de bloques...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
        {/* Header con estadísticas */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 sm:p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm sm:text-xl font-bold">Editor de Bloques</h2>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Trophy size={12} className="sm:w-4 sm:h-4" />
                <span>{xp} XP</span>
              </div>
              <div>💖 {lives}</div>
              <div>💡 {completedLEDs}/6</div>
            </div>
          </div>
        </div>

        {/* Área de Blockly */}
        <div className="relative">
          <div 
            style={{ 
              width: '100%', 
              height: '300px',
              minHeight: '250px'
            }} 
            ref={blocklyDiv} 
          />
        </div>

        {/* Controles */}
        <div className="p-2 sm:p-4 bg-gray-50 border-t">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Bloques: <span className="font-semibold">{countBlocks()}</span> / {tasks[currentTask].maxBlocks}
            </div>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={resetCode}
                disabled={isExecuting}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
              >
                <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Reiniciar</span>
                <span className="sm:hidden">Reset</span>
              </button>
              
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-semibold"
              >
                <Play size={14} className="sm:w-4 sm:h-4" />
                {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sistema de notificaciones */}
      <NotificationContainer 
        notifications={notifications.notifications} 
        onClose={notifications.removeNotification} 
      />
    </>
  );
};

export default BlocklyGame;