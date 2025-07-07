"use client";
import React, { useEffect } from "react";
import { useMisionMapamundiStore } from "./useMisionMapamundiStore";
import MapView from './MapView';
import tasksData from "../../data/mapamundi-tasks-v1.json";
import type { MapamundiTask } from "./types";
import { MapPin, Heart, Home, Stamp } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import dynamic from 'next/dynamic';
import { MapGame } from './MapGame';

const MapViewDynamic = dynamic(() => import('./MapView'), { ssr: false });

export default function Page() {
  const { 
    gameStatus, 
    completedStamps, 
    hearts, 
    xp, 
    badge,
    showInstructions,
    loadTasks, 
    startGame, 
    reset 
  } = useMisionMapamundiStore();
  const { goToDashboard } = useNavigation();

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks(tasksData as MapamundiTask[]);
  }, [loadTasks]);

  // Pantalla de instrucciones
  if (showInstructions && gameStatus === "instructions") {
    return (
      <main className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-3xl font-bold text-indigo-800 mb-4">¡Bienvenido a Misión Mapamundi!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>🎯 <strong>Tu misión:</strong> Localiza continentes, océanos y comunidades autónomas de España en el mapa para conseguir sellos en tu pasaporte.</p>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-bold text-indigo-800 mb-2">🗺️ ¿Cómo jugar?</h3>
              <ol className="text-left space-y-2">
                <li>1. 📍 <strong>Lee la pregunta</strong> que aparece sobre el mapa</li>
                <li>2. 🖱️ <strong>Haz clic</strong> en la región correcta del mapa</li>
                <li>3. ✅ Confirma tu selección con el botón</li>
                <li>4. 🏆 Cada acierto te da un <strong>sello</strong> en tu pasaporte</li>
                <li>5. ❤️ Tienes <strong>5 corazones</strong> - ¡no los pierdas todos!</li>
                <li>6. 📋 Completa <strong>10 misiones</strong> para ganar</li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">🌍 Tipos de misiones:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">🌍</div>
                  <strong>Continentes</strong>
                  <p>África, Asia, Europa...</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🌊</div>
                  <strong>Océanos</strong>
                  <p>Atlántico, Pacífico...</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🇪🇸</div>
                  <strong>España</strong>
                  <p>17 Comunidades Autónomas</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Stamp size={20} className="text-indigo-600" />
                <span className="text-sm text-gray-600">10 sellos por conseguir</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                <span className="text-sm text-gray-600">5 corazones</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={startGame}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              🧭 ¡Iniciar Misión!
            </button>
            <button 
              onClick={goToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors flex items-center gap-2"
            >
              <Home size={20} />
              Inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Pantalla de juego completado
  if (gameStatus === "completed") {
    return (
      <main className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">¡Misión Completada!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>🗺️ Has conseguido <strong>{completedStamps} sellos</strong> en tu pasaporte</p>
            <p>✨ Has ganado <strong>{xp} XP</strong></p>
            
            {badge && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-4xl mb-2">🌍</div>
                <h3 className="font-bold text-yellow-800">¡Explorador Global!</h3>
                <p className="text-sm">Completaste todas las misiones sin perder corazones</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={reset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 Nueva Misión
            </button>
            <button 
              onClick={goToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Home size={16} />
              Volver al Inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Pantalla de juego fallido
  if (gameStatus === "failed") {
    return (
      <main className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-3xl font-bold text-red-800 mb-4">¡Misión Fallida!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>💔 Te has quedado sin corazones</p>
            <p>🗺️ Conseguiste <strong>{completedStamps} sellos</strong> en tu pasaporte</p>
            <p>✨ Ganaste <strong>{xp} XP</strong></p>
            <p className="text-blue-600">¡No te preocupes! Puedes intentarlo de nuevo.</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={reset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 Reintentar Misión
            </button>
            <button 
              onClick={goToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Home size={16} />
              Volver al Inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Pantalla principal del juego
  return (
    <main className="min-h-screen bg-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Progreso de sellos */}
          <div className="flex items-center gap-2">
            <Stamp size={20} className="text-indigo-700" />
            <span className="font-bold text-indigo-800">
              Sellos: {completedStamps} / 10
            </span>
          </div>
          
          {/* Corazones */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Heart 
                key={i} 
                size={20} 
                className={i < hearts ? "text-red-500 fill-red-500" : "text-gray-300"} 
              />
            ))}
          </div>
          
          {/* XP */}
          <div className="flex items-center gap-2">
            <span className="text-indigo-800 font-semibold">XP: {xp}</span>
          </div>
        </div>
        
        {/* Botón salir */}
        <button 
          onClick={goToDashboard}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Home size={16} />
          Volver al Inicio
        </button>
      </header>

      {/* Área de juego */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {gameStatus === "playing" && (
          <>
            <MapGame />
            <MapViewDynamic mapKey={gameStatus + '-' + completedStamps + '-' + hearts} />
          </>
        )}
      </div>
    </main>
  );
}