"use client";
import React from 'react';
import { ArrowLeft, Award, CheckCircle, Beaker, Play, RotateCcw } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import useLaboratorioFlipStore from './useLaboratorioFlipStore';
import VideoCard from './VideoCard';
import Quiz from './Quiz';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const LaboratorioFlip: React.FC = () => {
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
              ¡Bienvenido al Laboratorio Flip-Ciencia!
            </CardTitle>
            <CardDescription className="text-lg">
              Aprende ciencia viendo videos y respondiendo quiz
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎯 Tu misión:</h3>
              <p className="text-gray-700">
                Completa 4 experimentos científicos viendo videos educativos y respondiendo preguntas.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🧪 Cómo funciona:</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Mira un video científico de ~90 segundos</li>
                <li>• Responde 3 preguntas sobre el contenido</li>
                <li>• Obtén al menos 2 respuestas correctas</li>
                <li>• Gana piezas para completar tu experimento virtual</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🏆 Recompensas:</h3>
              <div className="text-gray-700 space-y-1">
                <div>• +8 XP por cada respuesta correcta</div>
                <div>• +10 XP extra por completar cada lección</div>
                <div>• Piezas del experimento: 🧪 🟦 🟨 🔥</div>
                <div>• Badge &quot;Científico Novato&quot; al completar todo</div>
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
              Volver
            </Button>
            <Button
              size="lg"
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold transition-all transform hover:scale-105"
            >
              ¡Empezar Experimentos! 🧪
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
              ¡Experimento Completado!
            </CardTitle>
            <CardDescription className="text-lg">
              Has completado todos los experimentos científicos
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Experimento virtual completado */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-4">🧪 Tu Experimento Virtual:</h3>
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
                <div className="text-2xl mb-2">💥 ¡REACCIÓN EXITOSA! 💥</div>
                <p className="text-purple-700">
                  ¡Has combinado todos los elementos correctamente!
                </p>
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🏆 Has obtenido:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Badge</Badge>
                    <span className="text-gray-700">Científico Novato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-500 text-white">XP</Badge>
                    <span className="text-gray-700">{xp} puntos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Experimentos</Badge>
                    <span className="text-gray-700">4/4 completados</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                ¡Excelente trabajo aprendiendo ciencia! 🔬✨
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button size="lg" onClick={initializeGame} variant="outline" className="gap-2 mr-2">
              <RotateCcw size={18} />
              Nueva partida
            </Button>
            <Button
              size="lg"
              onClick={goToDashboard}
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
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                🧪 Laboratorio Flip-Ciencia
              </h1>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  📊 {completedLessons}/4 experimentos
                </Badge>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                🧩 {piecesObtained}/4 piezas
              </Badge>
              <Badge className="bg-teal-600 text-white text-sm px-3 py-1">
                ⭐ {xp} XP
              </Badge>
              {badge && (
                <Badge variant="warning" className="text-sm px-3 py-1 gap-1">
                  <Award size={14} />
                  Badge obtenido
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
          <h2 className="text-lg font-bold text-gray-800 mb-3">🧪 Tu Experimento Virtual</h2>
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
                Empezar Quiz
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
                  Quiz bloqueado
                </h3>
                <p className="text-gray-600">
                  Primero debes ver el video completo para desbloquear el quiz.
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
                {feedback.success ? '¡Excelente!' : '¡Ups!'}
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
                Continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LaboratorioFlip;
