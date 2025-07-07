"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useMapamundiV2Store } from "./useMapamundiV2Store";
import { MapamundiTask, GameMode, MODE_CONFIG } from "./types";
import Passport from "./Passport";
import WorldMap from "./WorldMap";
import SpainMap from "./SpainMap";

interface MapGameProps {
  mode: GameMode;
}

export default function MapGame({ mode }: MapGameProps) {
  const {
    currentTask,
    lives,
    completedStamps,
    tasks,
    selectedRegion,
    showFeedback,
    feedbackMessage,
    feedbackType,
    gameStatus,
    initializeGame,
    selectRegion,
    submitAnswer,
    nextTask,
    showFeedbackAction,
    hideFeedback,
    gainXP,
    completeWorld
  } = useMapamundiV2Store();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar el juego cuando se monta el componente
  useEffect(() => {
    initializeGame(mode);
  }, [mode, initializeGame]);

  // Obtener la tarea actual
  const currentTaskData = tasks[currentTask];
  const config = MODE_CONFIG[mode];

  // Verificar si el juego está completado
  const isGameCompleted = completedStamps >= config.maxQuestions;
  const isGameOver = lives <= 0;

  // Debug: mostrar estado actual
  console.log(`MapGame Debug: completedStamps=${completedStamps}, maxQuestions=${config.maxQuestions}, isGameCompleted=${isGameCompleted}`);

  // Verificar si las tareas están cargadas
  if (!tasks.length || !currentTaskData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas del juego...</p>
        </div>
      </div>
    );
  }

  // Manejar selección de región
  const handleRegionClick = (regionId: string) => {
    if (gameStatus !== 'playing' || isSubmitting) return;
    console.log("MapGame: Region clicked:", regionId); // Debug
    selectRegion(regionId);
  };

  // Manejar envío de respuesta
  const handleSubmit = () => {
    if (!selectedRegion || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Validar respuesta
    const isCorrect = selectedRegion === currentTaskData?.targetId;
    
    if (isCorrect) {
      // Acierto
      gainXP(config.xpPerCorrect);
      showFeedbackAction('success', `¡Correcto! ${currentTaskData?.explanation}`);
      
      // Usar la lógica del store para actualizar estado
      submitAnswer();
      
      // Avanzar a la siguiente pregunta
      setTimeout(() => {
        nextTask();
        setIsSubmitting(false);
        hideFeedback();
      }, 2000);
    } else {
      // Error
      showFeedbackAction('error', `Incorrecto. ${currentTaskData?.explanation}`);
      
      // Usar la lógica del store para actualizar estado
      submitAnswer();
      
      setTimeout(() => {
        setIsSubmitting(false);
        hideFeedback();
      }, 2000);
    }
  };

  // Renderizar pantalla de victoria
  if (gameStatus === 'completed' || isGameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">¡Misión Completada!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Has completado todas las preguntas de {config.badge.name}
          </p>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-green-800 mb-2">Recompensas:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Aciertos:</span>
                <span className="font-bold">+{completedStamps * config.xpPerCorrect} XP</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus:</span>
                <span className="font-bold">+{config.bonusXP} XP</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total:</span>
                <span className="font-bold text-green-800">
                  +{(completedStamps * config.xpPerCorrect) + config.bonusXP} XP
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                🏆
              </div>
              <span className="font-bold text-yellow-800">{config.badge.name}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                completeWorld();
                // Aquí se llamaría a Supabase
              }}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Guardar Progreso
            </button>
            <Link
              href="/world/mision-mapamundi-v2"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Volver al Selector
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar pantalla de game over
  if (gameStatus === 'gameOver' || isGameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-3xl font-bold text-red-800 mb-4">¡Game Over!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Te has quedado sin vidas. ¡Inténtalo de nuevo!
          </p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-red-800 mb-2">Progreso:</h3>
            <p className="text-sm">
              Completaste {completedStamps} de {config.maxQuestions} preguntas
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => initializeGame(mode)}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
            <Link
              href="/world/mision-mapamundi-v2"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Volver al Selector
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar pantalla de juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              href="/world/mision-mapamundi-v2"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Selector</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Vidas */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={i < lives ? "text-red-500 fill-current" : "text-gray-300"}
                />
              ))}
            </div>
            
            {/* Progreso */}
            <div className="text-sm text-gray-600">
              Pregunta {currentTask + 1} de {config.maxQuestions}
            </div>
          </div>
          
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Pasaporte */}
          <div className="mb-6">
            <Passport 
              completedStamps={completedStamps}
              totalStamps={config.maxQuestions}
              mode={mode}
            />
          </div>

          {/* Pregunta */}
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 rounded-full text-lg font-medium bg-indigo-100 text-indigo-800 mb-4">
              {mode === "continent" && "🌍 Continente"}
              {mode === "ocean" && "🌊 Océano"}
              {mode === "ccaa" && "🇪🇸 Comunidad Autónoma"}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentTaskData?.question}
            </h2>
          </div>

          {/* Mapa */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {mode === "ccaa" ? (
              <SpainMap
                task={currentTaskData}
                selectedRegion={selectedRegion}
                onRegionClick={handleRegionClick}
                onResult={() => {}} // Se maneja en handleSubmit
              />
            ) : (
              <WorldMap
                task={currentTaskData}
                selectedRegion={selectedRegion}
                onRegionClick={handleRegionClick}
                onResult={() => {}} // Se maneja en handleSubmit
              />
            )}
          </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedRegion || isSubmitting}
              className={`
                px-8 py-3 rounded-lg font-semibold transition-all
                ${selectedRegion && !isSubmitting
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? "Verificando..." : "Confirmar Selección"}
            </button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`
              fixed top-4 left-1/2 transform -translate-x-1/2 z-50
              px-6 py-4 rounded-lg shadow-lg max-w-md
              ${feedbackType === 'success' 
                ? 'bg-green-100 border border-green-300 text-green-800' 
                : 'bg-red-100 border border-red-300 text-red-800'
              }
            `}>
              <div className="flex items-center space-x-2">
                {feedbackType === 'success' ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <span className="font-medium">{feedbackMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 