'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react';
import useSteamStore from './useSteamStore';
import { initializeBlocks, initializeGenerators, getToolboxConfig } from './blocks';

// Define un tipo para el estado de Blockly
type BlocklyState = {
  Blockly: any;
  javascriptGenerator: any;
} | null;

const BlocklyGame: React.FC = () => {
  try {
    const workspaceRef = useRef<any>(null);
    const [blocklyState, setBlocklyState] = useState<BlocklyState>(null);
    const [blocklyLoaded, setBlocklyLoaded] = useState(false);
    
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
      
      console.log('[BlocklyGame] useEffect de carga de Blockly iniciado');
      const loadBlockly = async () => {
        console.log('[BlocklyGame] Intentando importar Blockly y javascriptGenerator...');
        if (typeof window === 'undefined') {
          console.error('[BlocklyGame] No hay window, abortando carga de Blockly');
          return;
        }
        
        try {
          const [blocklyModule, { javascriptGenerator }] = await Promise.all([
            import('blockly'),
            import('blockly/javascript')
          ]);
          
          if (!blocklyModule) {
            console.error('[BlocklyGame] blocklyModule es undefined');
          }
          if (!javascriptGenerator) {
            console.error('[BlocklyGame] javascriptGenerator es undefined');
          }
          if (isMounted) {
            console.log('[BlocklyGame] Módulos de Blockly importados', { blocklyModule, javascriptGenerator });
            setBlocklyState({ Blockly: blocklyModule, javascriptGenerator });
          }
        } catch (error) {
          console.error('[BlocklyGame] Error cargando Blockly:', error);
        }
      };
      
      loadBlockly();
      return () => { isMounted = false; };
    }, []);

    
    // Inicializar workspace de Blockly
    const blocklyDivRef = useCallback((node: HTMLDivElement | null) => {
      if (node && blocklyState && !workspaceRef.current) {
        console.log('[BlocklyGame] Inicializando workspace de Blockly...');
        
        const { Blockly, javascriptGenerator } = blocklyState;

        try {
          // Inicializar bloques y generadores
          console.log('[BlocklyGame] Llamando a initializeBlocks');
          initializeBlocks(Blockly);
          console.log('[BlocklyGame] Llamando a initializeGenerators');
          initializeGenerators(javascriptGenerator);
          console.log('[BlocklyGame] initializeGenerators ejecutado');

          // Inyectar workspace
          const workspace = Blockly.inject(node, {
            toolbox: getToolboxConfig(),
            grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
            zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
            trashcan: true
          });

          workspaceRef.current = workspace;
          console.log('[BlocklyGame] Workspace creado exitosamente');
          setBlocklyLoaded(true);

          // Cargar código guardado de localStorage
          const savedCode = localStorage.getItem('steam-session');
          if (savedCode) {
            try {
              const xml = Blockly.utils.xml.textToDom(savedCode);
              Blockly.Xml.domToWorkspace(xml, workspace);
              console.log('[BlocklyGame] Código guardado cargado');
            } catch (e) {
              console.warn('[BlocklyGame] No se pudo cargar el código guardado:', e);
            }
          }

          // Listener para cambios
          workspace.addChangeListener(() => {
            const code = javascriptGenerator.workspaceToCode(workspace);
            setBlocklyCode(code);
            
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.utils.xml.domToText(xml);
            localStorage.setItem('steam-session', xmlText);
          });

        } catch (error) {
          console.error('[BlocklyGame] Error inicializando Blockly:', error);
        }
      }
    }, [blocklyState, setBlocklyCode]);

    // Limpiar al desmontar
    useEffect(() => {
      return () => {
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        }
      };
    }, []);

    // Función para ejecutar el código
    const runCode = async () => {
      if (!workspaceRef.current || !blocklyState || isExecuting) return;

      const code = blocklyState.javascriptGenerator.workspaceToCode(workspaceRef.current);
      const blockCount = workspaceRef.current.getAllBlocks(false).length;
      const maxBlocks = tasks[currentTask]?.maxBlocks;

      if (maxBlocks && blockCount > maxBlocks) {
        alert(`¡Usa máximo ${maxBlocks} bloques! Actualmente usas ${blockCount}.`);
        return;
      }

      if (!code.trim()) {
        alert('¡Agrega algunos bloques para programar el robot!');
        return;
      }

      await executeCode(code);
    };

    // Función para reiniciar
    const handleReset = () => {
      if (workspaceRef.current) {
        workspaceRef.current.clear();
        // Restaurar bloques iniciales si es necesario
        const initialXml = localStorage.getItem('steam-initial');
        if (initialXml && blocklyState) {
          const xml = blocklyState.Blockly.utils.xml.textToDom(initialXml);
          blocklyState.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
        }
      }
      resetCurrentTask();
    };

    const getBlockCount = (): number => {
      if (!workspaceRef.current) return 0;
      // `getAllBlocks(false)` cuenta los bloques de usuario, no los de la toolbox.
      return workspaceRef.current.getAllBlocks(false).length;
    };

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Editor de Bloques</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1"><Trophy size={16} /><span>{xp} XP</span></div>
              <div className="flex items-center gap-1"><Heart size={16} /><span>{lives} vidas</span></div>
              <div className="flex items-center gap-1"><span>💡</span><span>{leds}/6 LEDs</span></div>
            </div>
          </div>
        </div>

        {/* Área de Blockly */}
        <div className="relative flex-grow h-0">
          {!blocklyLoaded && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Cargando editor de bloques...</p>
              </div>
            </div>
          )}
          <div 
            ref={blocklyDivRef} 
            className="w-full h-full"
          />
        </div>

        {/* Controles */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-600">
            Bloques: <span className="font-semibold">{blocklyLoaded ? getBlockCount() : 0}</span> / {tasks[currentTask]?.maxBlocks || '∞'}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <RotateCcw size={16} />
              Reiniciar
            </button>
            
            <button
              onClick={runCode}
              disabled={isExecuting || !blocklyLoaded}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Play size={16} />
              {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[BlocklyGame] Error crítico en el componente:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Error en el Editor de Bloques</h3>
        <p className="text-red-700 text-sm mb-2">Se ha producido un error al cargar el editor:</p>
        <pre className="text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <p className="text-red-700 text-sm mt-2">Revisa la consola del navegador para más detalles.</p>
      </div>
    );
  }
};

export default BlocklyGame; 