'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Award, CheckCircle, Home, Play, RotateCcw } from 'lucide-react';
import useSteamStore from './useSteamStore';
import RobotBoard from './RobotBoard';
import BlocklyGame, { BlocklyGameRef } from './BlocklyGame';
import { useNavigation } from '../../hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DesafioSteamV2: React.FC = () => {
  const [blocklyFunctions, setBlocklyFunctions] = useState<BlocklyGameRef | null>(null);
  const [blockCount, setBlockCount] = useState(0);
  const [isBlocklyLoaded, setIsBlocklyLoaded] = useState(false);
  const [forceUpdate] = useState(0);
  const { goToDashboard } = useNavigation();
  
  const {
    showInstructions,
    gameCompleted,
    feedback,
    xp,
    badge,
    tasks,
    currentTask,
    isExecuting,
    initializeGame,
    hideInstructions,
    hideFeedback
  } = useSteamStore();

  // Callback para cuando BlocklyGame esté listo
  const handleBlocklyReady = useCallback((functions: BlocklyGameRef) => {
    setBlocklyFunctions(functions);
    setIsBlocklyLoaded(functions.isLoaded());
  }, []);


  // Actualizar información del editor cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (blocklyFunctions) {
        const newBlockCount = blocklyFunctions.getBlockCount();
        const newIsLoaded = blocklyFunctions.isLoaded();
        setBlockCount(newBlockCount);
        setIsBlocklyLoaded(newIsLoaded);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blocklyFunctions]); // Solo depende de blocklyFunctions

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Pantalla de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <CardTitle className="text-3xl text-purple-800">
              ¡Bienvenido al Desafío STEAM!
            </CardTitle>
            <CardDescription className="text-lg">
              Programa un robot explorador con bloques visuales
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🎯 Tu misión:</h3>
              <p className="text-gray-700">
                Programa el robot para que llegue a la meta evitando obstáculos en un tablero 6×6.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🧩 Cómo jugar:</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Arrastra bloques de &quot;avanzar&quot;, &quot;girar izquierda&quot; y &quot;girar derecha&quot;</li>
                <li>• Usa bucles &quot;repetir&quot; para optimizar tu código</li>
                <li>• Respeta el límite de bloques de cada nivel</li>
                <li>• ¡El robot tiene 3 vidas por nivel!</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🏆 Objetivo:</h3>
              <p className="text-gray-700">
                Completa los 6 desafíos para obtener +140 XP y la insignia de Ingeniero Junior.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft size={20} />
              Volver
            </Button>
            <Button
              onClick={hideInstructions}
              size="xl"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all transform hover:scale-105"
            >
              ¡Empezar a Programar! 🚀
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Pantalla de juego completado
  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-2xl">
          <CardHeader>
            <Award size={80} className="text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-3xl text-green-800">
              ¡Felicitaciones!
            </CardTitle>
            <CardDescription className="text-lg">
              Has completado todos los desafíos STEAM
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🏆 Has obtenido:</h3>
              <div className="space-y-2">
                {badge && (
                  <div className="text-gray-700">
                    Insignia: <Badge variant="warning" className="ml-1">{badge.name}</Badge>
                  </div>
                )}
                <div className="text-gray-700">
                  XP total: <Badge variant="success" className="ml-1">{xp} puntos</Badge>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                ¡Excelente trabajo programando el robot! 🤖✨
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              onClick={goToDashboard}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Volver al Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Pantalla principal del juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      {/* Header */}
      <Card className="mb-4 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={goToDashboard}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Home size={18} />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                🤖 Desafío STEAM
              </h1>
            </div>
          
            <div className="flex items-center gap-3">
              <Badge variant="success" className="px-3 py-1 text-sm">
                ✨ XP: {xp}
              </Badge>
              {badge && (
                <Badge variant="warning" className="gap-1.5 px-3 py-1 text-sm">
                  <Award size={14} />
                  Insignia obtenida
                </Badge>
              )}
              <Badge variant="outline" className="px-3 py-1 text-sm">
                Nivel {currentTask + 1} / {tasks.length || 6}
              </Badge>
            </div>
          </div>

          {/* Level progress bar */}
          <div className="mt-3">
            <Progress
              value={currentTask}
              max={tasks.length || 6}
              className="h-2"
              indicatorClassName="bg-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Controles del Editor */}
      <Card className="mb-4 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                🧩 Bloques: <span className="font-semibold">{blockCount}</span> / {tasks[currentTask]?.maxBlocks || '∞'}
              </Badge>
            </div>
          
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (blocklyFunctions) {
                    blocklyFunctions.handleReset();
                  }
                }}
                disabled={isExecuting}
                variant="secondary"
                size="default"
                className="gap-2"
              >
                <RotateCcw size={16} />
                Reiniciar
              </Button>
            
              <Button
                onClick={() => {
                  if (blocklyFunctions) {
                    blocklyFunctions.runCode();
                  }
                }}
                disabled={isExecuting || !isBlocklyLoaded}
                size="lg"
                className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <Play size={16} />
                {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tablero del robot */}
          <div className="order-2 lg:order-1">
            <RobotBoard />
          </div>

          {/* Editor de bloques */}
          <div className="order-1 lg:order-2">
            <BlocklyGame 
              onReady={handleBlocklyReady} 
              key={forceUpdate} // Forzar re-mount cuando forceUpdate cambie
            />
          </div>
        </div>
      </div>

      {/* Modal de feedback */}
      {feedback?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center">
                {feedback.type === 'success' ? (
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                ) : (
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">❌</span>
                  </div>
                )}
              
                <h3 className={`text-xl font-bold mb-2 ${
                  feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {feedback.type === 'success' ? '¡Excelente!' : '¡Ups!'}
                </h3>
              
                <p className="text-gray-700 mb-6">
                  {feedback.message}
                </p>
              
                <Button
                  onClick={hideFeedback}
                  size="lg"
                  className={
                    feedback.type === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white font-semibold'
                      : 'bg-red-600 hover:bg-red-700 text-white font-semibold'
                  }
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DesafioSteamV2;