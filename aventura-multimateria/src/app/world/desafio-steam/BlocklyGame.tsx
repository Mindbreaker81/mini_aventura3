'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react';
import useSteamStore from './useSteamStore';
import { initializeBlocks, initializeGenerators, getToolboxConfig } from './blocks';

const BlocklyGame: React.FC = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const [Blockly, setBlockly] = useState<any>(null);
  const [javascriptGenerator, setJavascriptGenerator] = useState<any>(null);
  
  const { 
    tasks,
    currentTask,
    lives,
    leds,
    xp,
    isExecuting,
    setBlocklyCode,
    executeCode,
    resetCurrentTask
  } = useSteamStore();

  // Cargar Blockly dinámicamente
  useEffect(() => {
    let isMounted = true;
    
    const loadBlockly = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Importar Blockly y el generador JavaScript
        const blocklyModule = await import('blockly');
        const { javascriptGenerator } = await import('blockly/javascript');
        
        if (isMounted) {
          setBlockly(blocklyModule);
          setJavascriptGenerator(javascriptGenerator);
        }
      } catch (error) {
        console.error('Error loading Blockly:', error);
      }
    };
    
    loadBlockly();
    return () => { isMounted = false; };
  }, []);

  // Inicializar workspace de Blockly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!blocklyDiv.current || !Blockly || !javascriptGenerator) {
        return;
      }

      // Verificar dimensiones del div
      const rect = blocklyDiv.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      try {
        // Inicializar bloques personalizados
        initializeBlocks();
        initializeGenerators(javascriptGenerator);

        // Limpiar workspace anterior
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        }

        // Crear nuevo workspace
        const workspace = Blockly.inject(blocklyDiv.current, {
          toolbox: getToolboxConfig(),
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
          },
          trashcan: true
        });

        workspaceRef.current = workspace;
        setBlocklyLoaded(true);

        // Cargar código guardado
        if (typeof window !== 'undefined') {
          const savedCode = localStorage.getItem('steam-session');
          if (savedCode) {
            try {
              const xml = Blockly.utils.xml.textToDom(savedCode);
              Blockly.Xml.domToWorkspace(xml, workspace);
            } catch (error) {
              console.log('No se pudo cargar el código guardado');
            }
          }
        }

        // Listener para cambios en el workspace
        workspace.addChangeListener(() => {
          const code = javascriptGenerator.workspaceToCode(workspace);
          setBlocklyCode(code);
          
          // Guardar en localStorage
          if (typeof window !== 'undefined') {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.utils.xml.domToText(xml);
            localStorage.setItem('steam-session', xmlText);
          }
        });

      } catch (error) {
        console.error('Error inicializando Blockly:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [Blockly, javascriptGenerator, setBlocklyCode]);

  // Función para ejecutar el código
  const runCode = async () => {
    if (!workspaceRef.current || !javascriptGenerator || isExecuting) {
      return;
    }

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    const blockCount = workspaceRef.current.getAllBlocks().length;
    const maxBlocks = tasks[currentTask].maxBlocks;

    // Verificar límite de bloques
    if (blockCount > maxBlocks) {
      alert(`¡Usa máximo ${maxBlocks} bloques! Actualmente usas ${blockCount}.`);
      return;
    }

    if (!code.trim()) {
      alert('¡Agrega algunos bloques para programar el robot!');
      return;
    }

    // Parsear comandos del código
    const commands = parseCodeToCommands(code);
    
    if (commands.length === 0) {
      alert('No se encontraron comandos válidos en el código.');
      return;
    }

    // Ejecutar comandos
    await executeCode(commands);
  };

  // Función para parsear código a comandos
  const parseCodeToCommands = (code: string): string[] => {
    const commands: string[] = [];
    
    // Función para simular la ejecución y capturar comandos
    const mockFunctions = {
      move: (steps: number) => {
        for (let i = 0; i < steps; i++) {
          commands.push('move(1)');
        }
      },
      turnLeft: () => commands.push('turnLeft()'),
      turnRight: () => commands.push('turnRight()')
    };

    try {
      // Crear contexto seguro para evaluación
      const func = new Function('move', 'turnLeft', 'turnRight', code);
      func(mockFunctions.move, mockFunctions.turnLeft, mockFunctions.turnRight);
    } catch (error) {
      console.error('Error parsing code:', error);
    }

    return commands;
  };

  // Función para reiniciar
  const handleReset = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
    }
    resetCurrentTask();
  };

  // Función para contar bloques
  const getBlockCount = (): number => {
    if (!workspaceRef.current) return 0;
    return workspaceRef.current.getAllBlocks().length;
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
            <div className="flex items-center gap-1">
              <Heart size={16} />
              <span>{lives} vidas</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💡</span>
              <span>{leds}/6 LEDs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Blockly */}
      <div className="relative">
        <div 
          style={{ 
            width: '100%', 
            height: '400px',
            minHeight: '350px',
            display: 'block'
          }} 
          ref={blocklyDiv} 
          className="border-2 border-gray-200"
        />
      </div>

      {/* Controles */}
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Bloques usados: <span className="font-semibold">{getBlockCount()}</span> / {tasks[currentTask]?.maxBlocks}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>
          
          <button
            onClick={runCode}
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