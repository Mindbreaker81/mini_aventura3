'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect } from 'react';
import { ArrowLeft, Award, CheckCircle, Home } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import useSteamStore from './useSteamStore';
import RobotBoard from './RobotBoard';
import BlocklyGame from './BlocklyGame';

const DesafioSteamV2: React.FC = () => {
  const { goToDashboard } = useNavigation();
  const {
    showInstructions,
    gameCompleted,
    feedback,
    leds,
    xp,
    badge,
    initializeGame,
    hideInstructions,
    hideFeedback
  } = useSteamStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeGame();
    }
  }, [initializeGame]);

  // Pantalla de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              ¡Bienvenido al Desafío STEAM v2!
            </h1>
            <p className="text-gray-600 text-lg">
              Programa un robot explorador con bloques visuales
            </p>
          </div>

          <div className="space-y-4 mb-8">
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
              onClick={hideInstructions}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 font-semibold"
            >
              ¡Empezar a Programar! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de juego completado
  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
          <div className="mb-6">
            <Award size={80} className="text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              ¡Felicitaciones!
            </h1>
            <p className="text-gray-600 text-lg">
              Has completado todos los desafíos STEAM v2
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🏆 Has obtenido:</h3>
              <div className="space-y-2">
                {badge && (
                  <div className="text-gray-700">Insignia: {badge.name}</div>
                )}
                <div className="text-gray-700">XP total: {xp} puntos</div>
                <div className="text-gray-700">LEDs encendidos: {leds}/6</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                ¡Excelente trabajo programando el robot! 🤖✨
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={goToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Home size={20} />
              Dashboard
            </button>
            <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
              🤖 Desafío STEAM v2
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">LEDs encendidos</div>
              <div className="font-semibold">{leds}/6</div>
            </div>
            {badge && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Award size={20} />
                <span className="text-sm font-semibold">Insignia obtenida</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tablero del robot */}
          <div className="order-2 lg:order-1">
            <RobotBoard />
          </div>

          {/* Editor de bloques */}
          <div className="order-1 lg:order-2">
            <BlocklyGame />
          </div>
        </div>
      </div>

      {/* Modal de feedback */}
      {feedback?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
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
              
              <button
                onClick={hideFeedback}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
                  feedback.type === 'success' 
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

export default DesafioSteamV2;