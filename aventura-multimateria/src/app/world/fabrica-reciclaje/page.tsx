"use client";
import React, { useCallback } from "react";
import { useTranslation } from "../../components/I18nProvider";
import { useFabricaReciclajeStore } from "./useFabricaReciclajeStore";
import { BINS, ITEMS_POOL_ID, RECICLAJE_WIN_TARGET } from "./dragdrop-utils";
import type { ReciclajeItem } from "./types";
import { Home, Award, RotateCcw, Recycle } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { useGameSession } from "../../hooks/useGameSession";
import { useGameData } from "../../hooks/useGameData";
import { useReloadGameDataOnLocale } from "../../hooks/useReloadGameDataOnLocale";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { chainKeyboardHandler } from "../shared/keyboard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function FactorySVG({ sortedCount }: { sortedCount: number }) {
  const bins = ['🟡', '🔵', '🟢', '🟤', '🍃'];
  return (
    <svg viewBox="0 0 320 120" width="320" height="120" className="mx-auto mb-4" role="img" aria-label="Fábrica de reciclaje">
      <title>Fábrica de reciclaje</title>
      <rect x="20" y="40" width="280" height="60" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
      {bins.map((emoji, i) => (
        <g key={i}>
          <rect
            x={40 + i * 55}
            y="55"
            width="40"
            height="35"
            rx="4"
            fill={sortedCount > i ? '#86efac' : '#e5e7eb'}
            stroke="#059669"
            strokeWidth="1"
          />
          <text x={60 + i * 55} y="78" textAnchor="middle" fontSize="16">
            {emoji}
          </text>
        </g>
      ))}
      <rect x="130" y="20" width="60" height="25" rx="4" fill={sortedCount >= RECICLAJE_WIN_TARGET ? '#059669' : '#9ca3af'} />
      <text x="160" y="37" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        ♻️
      </text>
    </svg>
  );
}

export default function FabricaReciclajePage() {
  const { t } = useTranslation("common");
  const {
    roundItems,
    assigned,
    correctIds,
    sorted,
    feedback,
    xp,
    badge,
    gameStatus,
    showInstructions,
    loadItems,
    assignItem,
    resetGame,
    startGame,
  } = useFabricaReciclajeStore();
  const { goToDashboard } = useNavigation();
  const itemsData = useGameData("fabrica-reciclaje-items");

  const initIfNeeded = useCallback(() => {
    loadItems(itemsData as ReciclajeItem[]);
  }, [loadItems, itemsData]);

  useGameSession(useFabricaReciclajeStore.getState, initIfNeeded);
  useReloadGameDataOnLocale(useFabricaReciclajeStore.getState, initIfNeeded);

  const itemById = Object.fromEntries(roundItems.map((i) => [i.id, i]));
  const availableItems = roundItems.filter((i) => !correctIds.includes(i.id));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    assignItem(result.draggableId, result.destination.droppableId);
  };

  const feedbackItem = feedback ? itemById[feedback.itemId] : null;

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-green-200 shadow-lg">
          <CardHeader className="pb-2">
            <div className="text-6xl mb-2">♻️</div>
            <CardTitle className="text-3xl text-green-800">{t("reciclaje.instructions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>🎯 {t("reciclaje.instructions.mission")}</p>
            <Card className="bg-green-50/60 border-green-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-green-800 mb-2">📖 {t("reciclaje.instructions.howToPlay")}</h3>
                <ol className="text-left space-y-2">
                  <li>1. 🖱️ {t("reciclaje.instructions.step1")}</li>
                  <li>2. 🎯 {t("reciclaje.instructions.step2")}</li>
                  <li>3. ✅ {t("reciclaje.instructions.step3")}</li>
                  <li>4. 📚 {t("reciclaje.instructions.step4")}</li>
                  <li>5. 🏆 {t("reciclaje.instructions.step5")}</li>
                </ol>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center pt-2">
            <Button onClick={startGame} size="xl" className="bg-green-600 hover:bg-green-700">
              ♻️ {t("reciclaje.instructions.start")}
            </Button>
            <Button onClick={goToDashboard} variant="outline" size="lg" className="gap-2">
              <Home size={20} />
              {t("common.home")}
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (gameStatus === "completed") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-lg border-green-200">
          <CardHeader>
            <Award size={64} className="text-yellow-500 mx-auto mb-2" />
            <CardTitle className="text-3xl text-green-800">{t("reciclaje.completed.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FactorySVG sortedCount={RECICLAJE_WIN_TARGET} />
            {badge && <Badge variant="warning" className="text-base px-4 py-1">{t("reciclaje.completed.badge")}</Badge>}
            <Badge variant="success" className="text-base px-4 py-1">⭐ {xp} {t("common.xp")}</Badge>
          </CardContent>
          <CardFooter className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="outline" className="gap-2">
              <RotateCcw size={18} />
              {t("common.newGame")}
            </Button>
            <Button onClick={goToDashboard} className="gap-2">
              <Home size={18} />
              {t("common.dashboard")}
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-start p-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">⭐ XP: {xp}</Badge>
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Recycle size={16} className="text-green-700" />
            <span className="font-semibold text-sm text-muted-foreground whitespace-nowrap">{t("reciclaje.playing.progress")}</span>
            <Progress value={sorted} max={RECICLAJE_WIN_TARGET} className="h-3 w-28" indicatorClassName="bg-green-500" />
            <span className="text-sm font-mono text-green-700">{sorted}/{RECICLAJE_WIN_TARGET}</span>
          </div>
        </div>
        <Button onClick={goToDashboard} variant="destructive" size="sm" className="gap-2">
          <Home size={16} />
          {t("common.backToHome")}
        </Button>
      </header>

      <FactorySVG sortedCount={sorted} />

      <section className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={ITEMS_POOL_ID} direction="horizontal">
            {(provided) => (
              <Card className="flex-1" ref={provided.innerRef} {...provided.droppableProps}>
                <CardContent className="pt-4 pb-4">
                  <h2 className="font-semibold mb-2 text-base">📦 {t("reciclaje.playing.items")}</h2>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {availableItems.map((item, idx) => (
                      <Draggable key={item.id} draggableId={item.id} index={idx}>
                        {(prov) => (
                          <span
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            onKeyDown={chainKeyboardHandler(prov.dragHandleProps.onKeyDown)}
                            className="cursor-move px-3 py-2 rounded-md bg-emerald-100 shadow-sm text-emerald-900 font-medium border border-emerald-200 hover:bg-emerald-200 transition-colors"
                            tabIndex={0}
                            role="button"
                            aria-label={item.item}
                          >
                            {item.emoji ? `${item.emoji} ` : ''}{item.item}
                          </span>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </CardContent>
              </Card>
            )}
          </Droppable>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
            {BINS.map((bin) => (
              <Droppable droppableId={bin.key} key={bin.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-3 min-h-[90px] flex flex-col items-center border-2 border-dashed ${bin.color}`}
                  >
                    <span className="font-bold mb-2 text-sm text-center">
                      {bin.emoji} {t(`reciclaje.bins.${bin.key}`)}
                    </span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {Object.entries(assigned)
                        .filter(([, b]) => b === bin.key)
                        .map(([id], idx) => {
                          const label = itemById[id]?.item ?? id;
                          return (
                            <Draggable key={id} draggableId={id} index={idx}>
                              {(prov) => (
                                <span
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className="px-2 py-1 rounded-md bg-white border text-xs text-gray-700 shadow-sm max-w-[120px] truncate"
                                  title={label}
                                >
                                  {label}
                                </span>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </section>

      {feedback && feedbackItem && (
        <section className="mt-6 w-full max-w-4xl">
          <Card className={feedback.correct ? "border-green-300 bg-green-50/80" : "border-red-300 bg-red-50/80"}>
            <CardContent className="pt-4 pb-4">
              {feedback.correct ? (
                <>
                  <span className="font-bold text-green-800">✅ {t("reciclaje.playing.feedbackCorrect")} </span>
                  <br />
                  <span className="italic text-green-600 text-sm">💡 {feedback.rule}</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-red-800">🔄 {t("reciclaje.playing.feedbackRetry")} </span>
                  <span className="italic text-red-600 text-sm">{feedback.rule}</span>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  );
}
