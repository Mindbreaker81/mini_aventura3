"use client";
import React, { useCallback } from "react";
import { useTranslation } from "../../components/I18nProvider";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import { MarketGame } from "./MarketGame";
import tasksData from "../../data/mercado-tasks.json";
import type { MercadoTask } from "./types";
import { ShoppingCart, Heart, Home } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { useGameSession } from "../../hooks/useGameSession";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function MercadoNumerosPage() {
  const { t } = useTranslation("common");
  const {
    gameStatus, 
    completedBaskets, 
    hearts, 
    xp, 
    badge,
    loadTasks,
    newGame,
    startGame,
  } = useMercadoNumerosStore();
  const { goToDashboard } = useNavigation();

  const initIfNeeded = useCallback(() => {
    loadTasks(tasksData as MercadoTask[]);
  }, [loadTasks]);

  useGameSession(useMercadoNumerosStore.getState, initIfNeeded);

  const handleNewGame = () => {
    newGame(tasksData as MercadoTask[]);
  };

  // Pantalla de instrucciones
  if (gameStatus === "instructions") {
    return (
      <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center shadow-lg">
          <CardHeader>
            <div className="text-6xl mb-2">🏪</div>
            <CardTitle className="text-3xl text-orange-800">{t("mercado.instructions.title")}</CardTitle>
          </CardHeader>
          
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>🎯 {t("mercado.instructions.mission")}</p>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-bold text-orange-800 mb-2">🛒 {t("mercado.instructions.howToPlay")}</h3>
              <ol className="text-left space-y-2">
                <li>1. 💰 {t("mercado.instructions.step1")}</li>
                <li>2. 🛍️ {t("mercado.instructions.step2")}</li>
                <li>3. ❤️ {t("mercado.instructions.step3")}</li>
                <li>4. 🎯 {t("mercado.instructions.step4")}</li>
                <li>5. 🏆 {t("mercado.instructions.step5")}</li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">📚 {t("mercado.instructions.problemTypes")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <strong>{t("mercado.instructions.money")}</strong>
                  <p>{t("mercado.instructions.moneyDesc")}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⏰</div>
                  <strong>{t("mercado.instructions.time")}</strong>
                  <p>{t("mercado.instructions.timeDesc")}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🍰</div>
                  <strong>{t("mercado.instructions.fractions")}</strong>
                  <p>{t("mercado.instructions.fractionsDesc")}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
                <ShoppingCart size={16} className="text-orange-600" />
                {t("mercado.instructions.basketsGoal")}
              </Badge>
              <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-sm">
                <Heart size={16} />
                {t("mercado.instructions.hearts")}
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button 
              onClick={startGame}
              size="xl"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🛒 {t("mercado.instructions.start")}
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={20} />
              {t("common.home")}
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
            <CardTitle className="text-3xl text-green-800">{t("mercado.completed.title")}</CardTitle>
          </CardHeader>
          
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>🛒 {t("mercado.completed.baskets", { count: completedBaskets })}</p>
            <p>✨ {t("mercado.completed.xp", { count: xp })}</p>
            
            {badge && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-4xl mb-2">🏅</div>
                <h3 className="font-bold text-yellow-800">{t("mercado.completed.badge")}</h3>
                <p className="text-sm">{t("mercado.completed.badgeDesc")}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button 
              onClick={handleNewGame}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🔄 {t("mercado.completed.playAgain")}
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={16} />
              {t("common.backToHome")}
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
            <CardTitle className="text-3xl text-red-800">{t("mercado.failed.title")}</CardTitle>
          </CardHeader>
          
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>💔 {t("mercado.failed.noHearts")}</p>
            <p>🛒 {t("mercado.failed.baskets", { count: completedBaskets })}</p>
            <p>✨ {t("mercado.failed.xp", { count: xp })}</p>
            <p className="text-blue-600">{t("mercado.failed.encourage")}</p>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button 
              onClick={handleNewGame}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              🔄 {t("mercado.failed.retry")}
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={16} />
              {t("common.backToHome")}
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
                {t("mercado.playing.baskets", { current: completedBaskets, total: 8 })}
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
            {t("common.backToHome")}
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