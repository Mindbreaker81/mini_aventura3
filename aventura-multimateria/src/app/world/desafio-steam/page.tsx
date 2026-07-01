'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Award, CheckCircle, Home, Play, RotateCcw } from 'lucide-react';
import useSteamStore from './useSteamStore';
import RobotBoard from './RobotBoard';
import BlocklyGame, { BlocklyGameRef } from './BlocklyGame';
import { useNavigation } from '../../hooks/useNavigation';
import { useTranslation } from '../../components/I18nProvider';
import { useGameData } from '../../hooks/useGameData';
import { useReloadGameDataOnLocale } from '../../hooks/useReloadGameDataOnLocale';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DesafioSteamV2: React.FC = () => {
  const { t } = useTranslation('common');
  const [blocklyFunctions, setBlocklyFunctions] = useState<BlocklyGameRef | null>(null);
  const [blockCount, setBlockCount] = useState(0);
  const [isBlocklyLoaded, setIsBlocklyLoaded] = useState(false);
  const [forceUpdate] = useState(0);
  const { goToDashboard } = useNavigation();
  
  const {
    showInstructions,
    gameCompleted,
    gameStatus,
    feedback,
    xp,
    badge,
    tasks,
    currentTask,
    isExecuting,
    loadTasks,
    hideInstructions,
    hideFeedback,
    resetAdventure,
  } = useSteamStore();

  const steamTasks = useGameData('steam-tasks');

  const reloadTasks = useCallback(() => {
    loadTasks(steamTasks as Parameters<typeof loadTasks>[0]);
  }, [loadTasks, steamTasks]);

  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  useReloadGameDataOnLocale(useSteamStore.getState, reloadTasks);

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
  }, [blocklyFunctions]);

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
              {t('steam.instructions.title')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('steam.instructions.subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🎯 {t('steam.instructions.missionTitle')}</h3>
              <p className="text-gray-700">
                {t('steam.instructions.mission')}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🧩 {t('steam.instructions.howToPlayTitle')}</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• {t('steam.instructions.step1')}</li>
                <li>• {t('steam.instructions.step2')}</li>
                <li>• {t('steam.instructions.step3')}</li>
                <li>• {t('steam.instructions.step4')}</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🏆 {t('steam.instructions.goalTitle')}</h3>
              <p className="text-gray-700">
                {t('steam.instructions.goal')}
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
              {t('steam.instructions.back')}
            </Button>
            <Button
              onClick={hideInstructions}
              size="xl"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all transform hover:scale-105"
            >
              {t('steam.instructions.start')} 🚀
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Pantalla de game over
  if (gameStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-200 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-red-800">{t('steam.failed.title')}</CardTitle>
            <CardDescription className="text-lg">
              {t('steam.failed.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-base px-4 py-1">⭐ {t('common.xpAccumulated', { count: xp })}</Badge>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={resetAdventure} variant="outline" className="gap-2 flex-1">
              <RotateCcw size={18} />
              {t('steam.failed.reset')}
            </Button>
            <Button onClick={goToDashboard} className="flex-1 gap-2">
              <Home size={18} />
              {t('common.dashboard')}
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
              {t('steam.completed.title')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('steam.completed.subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🏆 {t('steam.completed.earned')}</h3>
              <div className="space-y-2">
                {badge && (
                  <div className="text-gray-700">
                    {t('steam.completed.badge')} <Badge variant="warning" className="ml-1">{badge.name}</Badge>
                  </div>
                )}
                <div className="text-gray-700">
                  {t('steam.completed.xpTotal')} <Badge variant="success" className="ml-1">{t('steam.completed.points', { count: xp })}</Badge>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                {t('steam.completed.praise')} 🤖✨
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button onClick={resetAdventure} variant="outline" className="gap-2">
              <RotateCcw size={18} />
              {t('steam.completed.newAdventure')}
            </Button>
            <Button
              onClick={goToDashboard}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {t('steam.completed.backDashboard')}
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
                {t('common.dashboard')}
              </Button>
              <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                🤖 {t('steam.title')}
              </h1>
            </div>
          
            <div className="flex items-center gap-3">
              <Badge variant="success" className="px-3 py-1 text-sm">
                ✨ XP: {xp}
              </Badge>
              {badge && (
                <Badge variant="warning" className="gap-1.5 px-3 py-1 text-sm">
                  <Award size={14} />
                  {t('steam.playing.badgeEarned')}
                </Badge>
              )}
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {t('steam.playing.levelProgress', { current: currentTask + 1, total: tasks.length || 6 })}
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
                🧩 {t('steam.playing.blocks')} <span className="font-semibold">{blockCount}</span> / {tasks[currentTask]?.maxBlocks || '∞'}
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
                {t('steam.playing.reset')}
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
                {isExecuting ? t('steam.playing.executing') : t('steam.playing.run')}
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
                  {feedback.type === 'success' ? t('steam.playing.feedbackSuccess') : t('steam.playing.feedbackFail')}
                </h3>
              
                <p className="text-gray-700 mb-6">
                  {t(feedback.message)}
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
                  {t('common.continue')}
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