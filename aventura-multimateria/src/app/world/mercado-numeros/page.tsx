"use client";
import React, { useEffect } from "react";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import { MarketGame } from "./MarketGame";
import tasksData from "../../data/mercado-tasks.json";
import type { MercadoTask } from "./types";
import { ShoppingCart, Heart, Home } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
        <Card className="max-w-2xl w-full text-center shadow-lg">
          <CardHeader>
            <div className="text-6xl mb-2">🏪</div>
            <CardTitle className="text-3xl text-orange-800">¡Bienvenido al Mercado de Números!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-lg text-gray-700 space-y-4">
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
              <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
                <ShoppingCart size={16} className="text-orange-600" />
                8 cestas por llenar
              </Badge>
              <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-sm">
                <Heart size={16} />
                3 corazones
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button 
              onClick={startGame}
              size="xl"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🛒 ¡Empezar en el Mercado!
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={20} />
              Inicio
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Pantalla de juego completado
  if (gameStatus === "completed") {
    return (
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center shadow-lg">
          <CardHeader>
            <div className="text-6xl mb-2">🎉</div>
            <CardTitle className="text-3xl text-green-800">¡Felicitaciones!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>🛒 Has llenado <strong>{completedBaskets} cestas</strong> de la compra</p>
            <p>✨ Has ganado <Badge variant="success" className="text-sm ml-1">{xp} XP</Badge></p>
            
            {badge && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-4xl mb-2">🏅</div>
                <h3 className="font-bold text-yellow-800">¡Maestro Monedero!</h3>
                <p className="text-sm">Completaste todos los retos sin perder corazones</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button 
              onClick={reset}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🔄 Jugar de Nuevo
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={16} />
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Pantalla de juego fallido
  if (gameStatus === "failed") {
    return (
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center shadow-lg">
          <CardHeader>
            <div className="text-6xl mb-2">😔</div>
            <CardTitle className="text-3xl text-red-800">¡Oh no!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>💔 Te has quedado sin corazones</p>
            <p>🛒 Llenaste <strong>{completedBaskets} cestas</strong> de la compra</p>
            <p>✨ Ganaste <Badge variant="success" className="text-sm ml-1">{xp} XP</Badge></p>
            <p className="text-blue-600">¡No te preocupes! Puedes intentarlo de nuevo.</p>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button 
              onClick={reset}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🔄 Intentar de Nuevo
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={16} />
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Pantalla principal del juego
  return (
    <main className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 shadow-md">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Progreso de cestas */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm font-bold text-orange-800 border-orange-300 bg-orange-50">
                <ShoppingCart size={16} className="text-orange-700" />
                Cestas: {completedBaskets} / 8
              </Badge>
            </div>

            {/* Barra de progreso */}
            <Progress 
              value={completedBaskets} 
              max={8} 
              className="w-24 h-3"
              indicatorClassName="bg-orange-500"
            />
          
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
            <Badge variant="success" className="px-3 py-1 text-sm">
              ✨ XP: {xp}
            </Badge>
          </div>
        
          {/* Botón salir */}
          <Button 
            onClick={goToDashboard}
            variant="ghost"
            size="sm"
            className="gap-2 text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            <Home size={16} />
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>

      {/* Área de juego */}
      <div className="flex-1 flex items-center justify-center p-4">
        <MarketGame />
      </div>
    </main>
  );
}