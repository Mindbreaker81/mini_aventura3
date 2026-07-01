"use client";

import React, { useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Home, Award, RotateCcw, Orbit, Heart } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { useGameSession } from "../../hooks/useGameSession";
import { useGameData } from "../../hooks/useGameData";
import { useReloadGameDataOnLocale } from "../../hooks/useReloadGameDataOnLocale";
import { useTranslation } from "../../components/I18nProvider";
import {
  usePlanetarioStore,
  getPoolBodyIds,
  formatOrder,
  type CelestialBody,
} from "./usePlanetarioStore";
import { POOL_DROPPABLE_ID, ROUND_SIZE } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function slotId(index: number) {
  return `slot-${index}`;
}

function parseSlotIndex(droppableId: string): number | null {
  if (!droppableId.startsWith("slot-")) return null;
  return Number(droppableId.replace("slot-", ""));
}

export default function PlanetarioPage() {
  const { t } = useTranslation("common");
  const { goToDashboard } = useNavigation();
  const {
    roundBodies,
    timeline,
    lives,
    xp,
    badge,
    gameStatus,
    showInstructions,
    feedback,
    loadBodies,
    startGame,
    moveToSlot,
    moveToPool,
    submitTimeline,
    hideFeedback,
    resetGame,
  } = usePlanetarioStore();

  const bodiesData = useGameData("planetario-bodies");

  const initIfNeeded = useCallback(() => {
    loadBodies(bodiesData as CelestialBody[]);
  }, [loadBodies, bodiesData]);

  useGameSession(usePlanetarioStore.getState, initIfNeeded);
  useReloadGameDataOnLocale(usePlanetarioStore.getState, initIfNeeded);

  const bodyById = Object.fromEntries(roundBodies.map((b) => [b.id, b]));
  const poolIds = getPoolBodyIds(roundBodies, timeline);
  const filledSlots = timeline.filter(Boolean).length;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const bodyId = result.draggableId;
    const dest = result.destination.droppableId;

    if (dest === POOL_DROPPABLE_ID) {
      moveToPool(bodyId);
      return;
    }

    const slotIndex = parseSlotIndex(dest);
    if (slotIndex !== null) {
      moveToSlot(bodyId, slotIndex);
    }
  };

  const feedbackMessage = feedback
    ? feedback.message.startsWith("planetario.")
      ? t(feedback.message)
      : feedback.message
    : "";

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-violet-200 shadow-lg">
          <CardHeader>
            <div className="text-6xl mb-2">🪐</div>
            <CardTitle className="text-3xl text-violet-900">{t("planetario.instructions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>{t("planetario.instructions.mission")}</p>
            <ol className="text-left space-y-2 list-decimal list-inside">
              <li>{t("planetario.instructions.step1")}</li>
              <li>{t("planetario.instructions.step2")}</li>
              <li>{t("planetario.instructions.step3")}</li>
              <li>{t("planetario.instructions.step4")}</li>
            </ol>
          </CardContent>
          <CardFooter className="flex gap-3 justify-center">
            <Button onClick={startGame} size="lg" className="bg-violet-600 hover:bg-violet-700">
              {t("planetario.instructions.start")}
            </Button>
            <Button onClick={goToDashboard} variant="outline" className="gap-2">
              <Home size={18} />
              {t("common.dashboard")}
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (gameStatus === "completed") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center border-green-200 shadow-lg">
          <CardHeader>
            <Award size={64} className="text-yellow-500 mx-auto" />
            <CardTitle className="text-3xl text-green-800">{t("planetario.completed.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {badge && <Badge variant="warning">{t("planetario.completed.badge")}</Badge>}
            <Badge variant="success">⭐ {xp} XP</Badge>
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

  if (gameStatus === "failed") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-red-800">{t("planetario.failed.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">⭐ {xp} XP</Badge>
          </CardContent>
          <CardFooter className="flex gap-3 justify-center">
            <Button onClick={resetGame} variant="outline" className="gap-2">
              <RotateCcw size={18} />
              {t("common.retry")}
            </Button>
            <Button onClick={goToDashboard}>{t("common.dashboard")}</Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-100 p-4">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary">⭐ {xp} XP</Badge>
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={18} className={i < lives ? "text-red-500 fill-red-500" : "text-gray-300"} />
            ))}
          </div>
          <Progress value={filledSlots} max={ROUND_SIZE} className="w-28 h-2" indicatorClassName="bg-violet-500" />
          <span className="text-sm text-violet-800">{filledSlots}/{ROUND_SIZE}</span>
        </div>
        <Button onClick={goToDashboard} variant="destructive" size="sm" className="gap-2">
          <Home size={16} />
          {t("common.dashboard")}
        </Button>
      </header>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-violet-900 mb-4 flex items-center gap-2">
          <Orbit size={28} />
          {t("planetario.title")}
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <section className="mb-8">
            <h2 className="font-semibold text-violet-800 mb-3">{t("planetario.orbit")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {timeline.map((bodyId, index) => (
                <Droppable droppableId={slotId(index)} key={slotId(index)}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[100px] rounded-lg border-2 border-dashed border-violet-300 bg-white/70 p-2"
                    >
                      <span className="text-xs font-bold text-violet-600">{index + 1}</span>
                      {bodyId && bodyById[bodyId] ? (
                        <Draggable draggableId={bodyId} index={0}>
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="mt-1 p-2 rounded-md bg-violet-100 border border-violet-200 text-sm cursor-move"
                            >
                              <div className="font-semibold">
                                {bodyById[bodyId].emoji ? `${bodyById[bodyId].emoji} ` : ''}
                                {bodyById[bodyId].name}
                              </div>
                              <div className="text-xs text-violet-700">{formatOrder(bodyById[bodyId].order)}</div>
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <p className="text-xs text-gray-400 mt-4 text-center">{t("planetario.emptySlot")}</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-violet-800 mb-3">{t("planetario.pool")}</h2>
            <Droppable droppableId={POOL_DROPPABLE_ID} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-2 min-h-[80px] p-3 rounded-lg bg-white/80 border border-violet-200"
                >
                  {poolIds.map((id, index) => {
                    const body = bodyById[id];
                    if (!body) return null;
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="px-3 py-2 rounded-md bg-purple-100 border border-purple-200 cursor-move min-w-[140px]"
                          >
                            <div className="font-medium text-sm">
                              {body.emoji ? `${body.emoji} ` : ''}{body.name}
                            </div>
                            <div className="text-xs text-purple-700">{formatOrder(body.order)}</div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        </DragDropContext>

        {feedback && (
          <Card className={`mt-6 ${feedback.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
            <CardContent className="pt-4 pb-4 flex justify-between items-center gap-3">
              <span>{feedbackMessage}</span>
              <Button size="sm" variant="outline" onClick={hideFeedback}>{t("common.continue")}</Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Button size="lg" onClick={submitTimeline} className="bg-violet-600 hover:bg-violet-700">
            {t("planetario.checkOrder")}
          </Button>
        </div>
      </div>
    </main>
  );
}
