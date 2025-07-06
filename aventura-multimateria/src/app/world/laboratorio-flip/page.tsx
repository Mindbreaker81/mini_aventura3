"use client";
import React, { useEffect } from 'react';
import { ArrowLeft, Award, CheckCircle, Beaker, Play } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import useLaboratorioFlipStore from './useLaboratorioFlipStore';
import VideoCard from './VideoCard';
import Quiz from './Quiz';

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
    currentLesson,
    completedLessons,
    experimentPieces,
    piecesObtained,
    videoWatched,
    lessons,
  } = useLaboratorioFlipStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Beaker size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              ¡Bienvenido al Laboratorio Flip-Ciencia!
            </h1>
            <p className="text-gray-600 text-lg">
              Aprende ciencia viendo videos y respondiendo quiz
            </p>
          </div>

          <div className="space-y-4 mb-8">
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
                <div>• Badge "Científico Novato" al completar todo</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={goToDashboard}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
            <button
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 font-semibold"
            >
              ¡Empezar Experimentos! 🧪
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de juego completado
  if (gameStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
          <div className="mb-6">
            <Award size={80} className="text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              ¡Experimento Completado!
            </h1>
            <p className="text-gray-600 text-lg">
              Has completado todos los experimentos científicos
            </p>
          </div>

          {/* Experimento virtual completado */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
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

          <div className="space-y-4 mb-8">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🏆 Has obtenido:</h3>
              <div className="space-y-2">
                <div className="text-gray-700">Badge: Científico Novato</div>
                <div className="text-gray-700">XP total: {xp} puntos</div>
                <div className="text-gray-700">Experimentos completados: 4/4</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                ¡Excelente trabajo aprendiendo ciencia! 🔬✨
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={goToDashboard}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla principal del juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={goToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Dashboard
            </button>
            <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
              🧪 Laboratorio Flip-Ciencia
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Progreso</div>
              <div className="font-semibold">{completedLessons}/4 experimentos</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Piezas</div>
              <div className="font-semibold">{piecesObtained}/4</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">XP</div>
              <div className="font-semibold">{xp}</div>
            </div>
            {badge && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Award size={20} />
                <span className="text-sm font-semibold">Badge obtenido</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experimento virtual */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🧪 Tu Experimento Virtual</h2>
        <div className="flex justify-center items-center gap-6">
          {experimentPieces.map((piece, index) => (
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
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Video */}
        <div>
          <VideoCard onVideoEnd={handleVideoEnd} />
          
          {videoWatched && gameStatus === 'video' && (
            <div className="mt-4 text-center">
              <button
                onClick={handleStartQuiz}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 mx-auto"
              >
                <Play size={20} />
                Empezar Quiz
              </button>
            </div>
          )}
        </div>

        {/* Quiz */}
        <div>
          {gameStatus === 'quiz' ? (
            <Quiz />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Quiz bloqueado
              </h3>
              <p className="text-gray-600">
                Primero debes ver el video completo para desbloquear el quiz.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center">
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
              
              <button
                onClick={hideFeedback}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
                  feedback.success 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratorioFlip;