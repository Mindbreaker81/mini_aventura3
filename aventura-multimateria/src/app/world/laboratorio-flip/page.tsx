"use client";
import React from 'react';
import { ArrowLeft, Award, CheckCircle, Beaker, Play, RotateCcw } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { useTranslation } from '../../components/I18nProvider';
import useLaboratorioFlipStore from './useLaboratorioFlipStore';
import VideoCard from './VideoCard';
import Quiz from './Quiz';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const LaboratorioFlip: React.FC = () => {
  const { t } = useTranslation('common');
  const { goToDashboard } = useNavigation();
  const {
    initializeGame,
    showInstructions,
    hideInstructionsScreen,
    startQuiz,
    feedback,
    hideFeedback,
    gameStatus,
    xp,
    badge,
    completedLessons,
    experimentPieces,
    piecesObtained,
    videoWatched,
  } = useLaboratorioFlipStore();

  const handleStartGame = () => {
    hideInstructionsScreen();
  };

  const handleVideoEnd = () => {
    // El video ha terminado o se ha visto suficiente
  };

  const handleStartQuiz = () => {
    if (videoWatched) {
      startQuiz();
    }
  };

  // Pantalla de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Beaker size={40} className="text-white" />
            </div>
            <CardTitle className="text-3xl text-green-800">
              {t('flip.instructions.title')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('flip.instructions.subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎯 {t('flip.instructions.missionTitle')}</h3>
              <p className="text-gray-700">
                {t('flip.instructions.mission')}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🧪 {t('flip.instructions.howTitle')}</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• {t('flip.instructions.step1')}</li>
                <li>• {t('flip.instructions.step2')}</li>
                <li>• {t('flip.instructions.step3')}</li>
                <li>• {t('flip.instructions.step4')}</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🏆 {t('flip.instructions.rewardsTitle')}</h3>
              <div className="text-gray-700 space-y-1">
                <div>• {t('flip.instructions.reward1')}</div>
                <div>• {t('flip.instructions.reward2')}</div>
                <div>• {t('flip.instructions.reward3')}</div>
                <div>• {t('flip.instructions.reward4')}</div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={goToDashboard}
              className="gap-2"
            >
              <ArrowLeft size={20} />
              {t('flip.instructions.back')}
            </Button>
            <Button
              size="lg"
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold transition-all transform hover:scale-105"
            >
              {t('flip.instructions.start')} 🧪
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Pantalla de juego completado
  if (gameStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full shadow-2xl border-0 text-center">
          <CardHeader className="pb-2">
            <Award size={80} className="text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-3xl text-green-800">
              {t('flip.completed.title')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('flip.completed.subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-4">🧪 {t('flip.completed.virtualExp')}</h3>
              <div className="flex justify-center items-center gap-4 text-4xl mb-4">
                {experimentPieces.map((piece) => (
                  <div
                    key={piece.id}
                    className={`transition-all duration-500 ${
                      piece.obtained ? 'scale-110 animate-bounce' : 'opacity-30'
                    }`}
                  >
                    {piece.icon}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💥 {t('flip.completed.reaction')} 💥</div>
                <p className="text-purple-700">
                  {t('flip.completed.reactionDesc')}
                </p>
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🏆 {t('flip.completed.earned')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Badge</Badge>
                    <span className="text-gray-700">{t('flip.completed.badgeName')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-500 text-white">{t('common.xp')}</Badge>
                    <span className="text-gray-700">{t('steam.completed.points', { count: xp })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Experimentos</Badge>
                    <span className="text-gray-700">{t('flip.completed.experiments')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                {t('flip.completed.praise')} 🔬✨
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button size="lg" onClick={initializeGame} variant="outline" className="gap-2 mr-2">
              <RotateCcw size={18} />
              {t('common.newGame')}
            </Button>
            <Button
              size="lg"
              onClick={goToDashboard}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {t('flip.completed.backDashboard')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Pantalla principal del juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 p-4">
      {/* Header */}
      <Card className="mb-4 border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={goToDashboard}
                className="gap-2"
              >
                <ArrowLeft size={20} />
                {t('common.dashboard')}
              </Button>
              <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                🧪 {t('flip.title')}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  📊 {t('flip.playing.experiments', { current: completedLessons })}
                </Badge>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                🧩 {t('flip.playing.pieces', { current: piecesObtained })}
              </Badge>
              <Badge className="bg-teal-600 text-white text-sm px-3 py-1">
                ⭐ {xp} {t('common.xp')}
              </Badge>
              {badge && (
                <Badge variant="warning" className="text-sm px-3 py-1 gap-1">
                  <Award size={14} />
                  {t('flip.playing.badgeEarned')}
                </Badge>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <Progress
              value={completedLessons}
              max={4}
              className="h-2"
              indicatorClassName="bg-gradient-to-r from-green-500 to-teal-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Experimento virtual */}
      <Card className="mb-4 border-0 shadow-lg">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">🧪 {t('flip.playing.virtualExp')}</h2>
          <div className="flex justify-center items-center gap-6">
            {experimentPieces.map((piece) => (
              <div
                key={piece.id}
                className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                  piece.obtained ? 'scale-110' : 'opacity-30'
                }`}
              >
                <div className={`text-3xl ${piece.obtained ? 'animate-pulse' : ''}`}>
                  {piece.icon}
                </div>
                <span className="text-xs text-gray-600 text-center">{piece.name}</span>
                {piece.obtained && (
                  <CheckCircle size={16} className="text-green-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Video */}
        <div>
          <VideoCard onVideoEnd={handleVideoEnd} />
          
          {videoWatched && gameStatus === 'video' && (
            <div className="mt-4 text-center">
              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-105"
              >
                <Play size={20} />
                {t('flip.playing.startQuiz')}
              </Button>
            </div>
          )}
        </div>

        {/* Quiz */}
        <div>
          {gameStatus === 'quiz' ? (
            <Quiz />
          ) : (
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {t('flip.playing.quizLocked')}
                </h3>
                <p className="text-gray-600">
                  {t('flip.playing.quizLockedDesc')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full shadow-2xl border-0">
            <CardContent className="p-6 text-center">
              {feedback.success ? (
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              ) : (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">❌</span>
                </div>
              )}
              
              <h3 className={`text-xl font-bold mb-2 ${
                feedback.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {feedback.success ? t('flip.playing.feedbackSuccess') : t('flip.playing.feedbackFail')}
              </h3>
              
              <p className="text-gray-700 mb-4">
                {feedback.message}
              </p>

              {feedback.explanation && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-blue-800 text-sm">
                    {feedback.explanation}
                  </p>
                </div>
              )}
              
              <Button
                onClick={hideFeedback}
                className={`font-semibold ${
                  feedback.success 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {t('common.continue')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LaboratorioFlip;
