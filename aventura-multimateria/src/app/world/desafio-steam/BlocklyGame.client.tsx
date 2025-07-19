'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react';
import useSteamStore from './useSteamStore';
import { initializeBlocks, initializeGenerators, getToolboxConfig } from './blocks';
import { safeWorkspaceToCode, safeBlocklyOperation } from './blockly-utils';

// Define un tipo para el estado de Blockly
type BlocklyState = {
  Blockly: any;
  javascriptGenerator: any;
} | null;

// Define la interfaz para las funciones expuestas
export interface BlocklyGameRef {
  runCode: () => Promise<void>;
  handleReset: () => void;
  getBlockCount: () => number;
  isLoaded: () => boolean;
}

interface BlocklyGameProps {
  onReady?: (functions: BlocklyGameRef) => void;
}

const BlocklyGame: React.FC<BlocklyGameProps> = ({ onReady }) => {
  const workspaceRef = useRef<any>(null);
  const [blocklyState, setBlocklyState] = useState<BlocklyState>(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const initializedRef = useRef(false);
  
  const { 
    tasks,
    currentTask,
    lives,
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
      
      const { Blockly, javascriptGenerator } = blocklyState;

      try {
        // Inicializar bloques y generadores
        initializeBlocks(Blockly);
        initializeGenerators(javascriptGenerator);

        // Inyectar workspace
        const workspace = Blockly.inject(node, {
          toolbox: getToolboxConfig(),
          grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
          zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
          trashcan: true,
          move: {
            scrollbars: true,
            drag: true,
            wheel: true
          },
          sounds: false
        });

        workspaceRef.current = workspace;
        setBlocklyLoaded(true);
        initializedRef.current = true;

        // Proteger blocklyLoaded de cambios innecesarios
        setTimeout(() => {
          if (!blocklyLoaded && initializedRef.current) {
            setBlocklyLoaded(true);
          }
        }, 1000);

        // Hack más robusto: forzar z-index y posición de la papelera
        setTimeout(() => {
          const trashcan = node.querySelector('.blocklyTrash');
          if (trashcan) {
            const trashElement = trashcan as HTMLElement;
            trashElement.style.zIndex = '9999';
            trashElement.style.position = 'absolute';
            trashElement.style.bottom = '10px';
            trashElement.style.right = '10px';
            trashElement.style.pointerEvents = 'auto';
            trashElement.style.cursor = 'pointer';
          }
        }, 1000);

        // Cargar código guardado de localStorage
        const savedCode = localStorage.getItem('steam-session');
        if (savedCode) {
          try {
            const xml = Blockly.utils.xml.textToDom(savedCode);
            Blockly.Xml.domToWorkspace(xml, workspace);
          } catch (e) {
            console.warn('[BlocklyGame] No se pudo cargar el código guardado:', e);
          }
        }

        // Listener para cambios
        workspace.addChangeListener(() => {
          const code = safeWorkspaceToCode(javascriptGenerator, workspace);
          setBlocklyCode(code);
          
          const xml = Blockly.Xml.workspaceToDom(workspace);
          const xmlText = Blockly.utils.xml.domToText(xml);
          localStorage.setItem('steam-session', xmlText);
        });

      } catch (error) {
        console.error('[BlocklyGame] Error inicializando Blockly:', error);
      }
    }
  }, [blocklyState]); // Removido setBlocklyCode de las dependencias

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
  const runCode = useCallback(async () => {
    
    if (!workspaceRef.current || !blocklyState || isExecuting) {
      return;
    }

    const code = safeWorkspaceToCode(blocklyState.javascriptGenerator, workspaceRef.current);
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
  }, [workspaceRef, blocklyState, isExecuting, tasks, currentTask, executeCode]);

  // Función para reiniciar
  const handleReset = useCallback(() => {
    
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      
      // Restaurar bloques iniciales si es necesario
      const initialXml = localStorage.getItem('steam-initial');
      if (initialXml && blocklyState) {
        const xml = blocklyState.Blockly.utils.xml.textToDom(initialXml);
        blocklyState.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      }
    } else {
      console.warn('[BlocklyGame] No hay workspace para reiniciar');
    }
    
    resetCurrentTask();
  }, [workspaceRef, blocklyState, resetCurrentTask]);

  const getBlockCount = (): number => {
    if (!workspaceRef.current) return 0;
    // `getAllBlocks(false)` cuenta los bloques de usuario, no los de la toolbox.
    return workspaceRef.current.getAllBlocks(false).length;
  };

  // Asegurar que blocklyLoaded permanezca true una vez inicializado
  const effectiveBlocklyLoaded = blocklyLoaded || initializedRef.current;

  // Forzar llamada a onReady inmediatamente cuando effectiveBlocklyLoaded sea true
  if (effectiveBlocklyLoaded && onReady) {
    setTimeout(() => {
      onReady({
        runCode,
        handleReset,
        getBlockCount,
        isLoaded: () => effectiveBlocklyLoaded
      });
    }, 0);
  }

  // Exponer funciones al componente padre
  useEffect(() => {
    if (onReady && effectiveBlocklyLoaded) {
      onReady({
        runCode,
        handleReset,
        getBlockCount,
        isLoaded: () => effectiveBlocklyLoaded
      });
    }
  }, [effectiveBlocklyLoaded, onReady]); // Solo estas dependencias

  // Forzar que useImperativeHandle se ejecute cuando el workspace esté listo
  useEffect(() => {
    if (workspaceRef.current && effectiveBlocklyLoaded) {
      // Forzar que useImperativeHandle se ejecute
      if (onReady) {
        onReady({
          runCode,
          handleReset,
          getBlockCount,
          isLoaded: () => effectiveBlocklyLoaded
        });
      }
    }
  }, [workspaceRef.current, effectiveBlocklyLoaded, onReady, runCode, handleReset, getBlockCount]);

  // Forzar ejecución de useImperativeHandle en cada render cuando esté listo
  useEffect(() => {
    if (effectiveBlocklyLoaded && workspaceRef.current) {
      // Forzar re-render para que useImperativeHandle se ejecute
      const timeoutId = setTimeout(() => {
        if (onReady) {
          onReady({
            runCode,
            handleReset,
            getBlockCount,
            isLoaded: () => effectiveBlocklyLoaded
          });
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Editor de Bloques</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1"><Trophy size={16} /><span>{xp} XP</span></div>
            <div className="flex items-center gap-1"><Heart size={16} /><span>{lives} vidas</span></div>
          </div>
        </div>
      </div>

      {/* Área de Blockly */}
      <div className="relative flex-grow h-0">
        {!effectiveBlocklyLoaded && (
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
          style={{ 
            minHeight: 600, 
            height: '100%', 
            position: 'relative', 
            overflow: 'hidden',
            zIndex: 1,
            border: '1px solid #ccc'
          }}
        />
      </div>
    </div>
  );
};

export default BlocklyGame; 