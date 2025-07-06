"use client";
import React, { useEffect } from "react";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import { MarketGame } from "./MarketGame";
import tasksData from "../../data/mercado-tasks.json";
import type { MercadoTask } from "./types";
import { ShoppingCart, Heart, X, Home } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";

export default function MercadoNumerosPage() {
  const { 
    gameStatus, 
    completedBaskets, 
    hearts, 
    xp, 
    badge,
    loadTasks, 
    startGame, 
    reset 
  } = useMercadoNumerosStore();
  const { goToDashboard } = useNavigation();

  // Cargar tareas al montar el componente
  useEffect(() => {
    loadTasks(tasksData as MercadoTask[]);
  }, [loadTasks]);

  // Pantalla de instrucciones
  if (gameStatus === "instructions") {
    return (
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-3xl font-bold text-orange-800 mb-4">¡Bienvenido al Mercado de Números!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>🎯 <strong>Tu misión:</strong> Ayuda al tendero resolviendo problemas de matemáticas para llenar las cestas de la compra.</p>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-bold text-orange-800 mb-2">🛒 ¿Cómo jugar?</h3>
              <ol className="text-left space-y-2">
                <li>1. 💰 <strong>Resuelve problemas</strong> de dinero, tiempo y fracciones</li>
                <li>2. 🛍️ Cada acierto <strong>llena una cesta</strong> de la compra</li>
                <li>3. ❤️ Tienes <strong>3 corazones</strong> - ¡no los pierdas todos!</li>
                <li>4. 🎯 Completa <strong>8 cestas</strong> para ganar</li>
                <li>5. 🏆 Si no pierdes ningún corazón, ¡consigues medalla especial!</li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">📚 Tipos de problemas:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <strong>Dinero</strong>
                  <p>Paga con monedas y billetes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⏰</div>
                  <strong>Tiempo</strong>
                  <p>Calcula horas y minutos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🍰</div>
                  <strong>Fracciones</strong>
                  <p>Divide y cuenta partes</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-orange-600" />
                <span className="text-sm text-gray-600">8 cestas por llenar</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                <span className="text-sm text-gray-600">3 corazones</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={startGame}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              🛒 ¡Empezar en el Mercado!
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
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">¡Felicitaciones!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>🛒 Has llenado <strong>{completedBaskets} cestas</strong> de la compra</p>
            <p>✨ Has ganado <strong>{xp} XP</strong></p>
            
            {badge && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-4xl mb-2">🏅</div>
                <h3 className="font-bold text-yellow-800">¡Maestro Monedero!</h3>
                <p className="text-sm">Completaste todos los retos sin perder corazones</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={reset}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 Jugar de Nuevo
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
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-3xl font-bold text-red-800 mb-4">¡Oh no!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>💔 Te has quedado sin corazones</p>
            <p>🛒 Llenaste <strong>{completedBaskets} cestas</strong> de la compra</p>
            <p>✨ Ganaste <strong>{xp} XP</strong></p>
            <p className="text-blue-600">¡No te preocupes! Puedes intentarlo de nuevo.</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={reset}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 Intentar de Nuevo
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
    <main className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-orange-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Progreso de cestas */}
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-orange-700" />
            <span className="font-bold text-orange-800">
              Cestas: {completedBaskets} / 8
            </span>
          </div>
          
          {/* Corazones */}
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={20} 
                className={i < hearts ? "text-red-500 fill-red-500" : "text-gray-300"} 
              />
            ))}
          </div>
          
          {/* XP */}
          <div className="flex items-center gap-2">
            <span className="text-orange-800 font-semibold">XP: {xp}</span>
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
      <div className="flex-1 flex items-center justify-center p-4">
        <MarketGame />
      </div>
    </main>
  );
}