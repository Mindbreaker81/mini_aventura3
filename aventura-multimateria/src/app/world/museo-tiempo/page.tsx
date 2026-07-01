"use client";

import React, { useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Home, Award, RotateCcw, Clock, Heart } from "lucide-react";
import eventsData from "../../data/museo-events.json";
import { useNavigation } from "../../hooks/useNavigation";
import { useGameSession } from "../../hooks/useGameSession";
import { useTranslation } from "../../components/I18nProvider";
import {
  useMuseoTiempoStore,
  getPoolEventIds,
  formatYear,
} from "./useMuseoTiempoStore";
import { POOL_DROPPABLE_ID, ROUND_SIZE, type HistoricalEvent } from "./types";
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

export default function MuseoTiempoPage() {
  const { t } = useTranslation("common");
  const { goToDashboard } = useNavigation();
  const {
    roundEvents,
    timeline,
    lives,
    xp,
    badge,
    gameStatus,
    showInstructions,
    feedback,
    loadEvents,
    startGame,
    moveToSlot,
    moveToPool,
    submitTimeline,
    hideFeedback,
    resetGame,
  } = useMuseoTiempoStore();

  const initIfNeeded = useCallback(() => {
    loadEvents(eventsData as HistoricalEvent[]);
  }, [loadEvents]);

  useGameSession(useMuseoTiempoStore.getState, initIfNeeded);

  const eventById = Object.fromEntries(roundEvents.map((e) => [e.id, e]));
  const poolIds = getPoolEventIds(roundEvents, timeline);
  const filledSlots = timeline.filter(Boolean).length;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const eventId = result.draggableId;
    const dest = result.destination.droppableId;

    if (dest === POOL_DROPPABLE_ID) {
      moveToPool(eventId);
      return;
    }

    const slotIndex = parseSlotIndex(dest);
    if (slotIndex !== null) {
      moveToSlot(eventId, slotIndex);
    }
  };

  const feedbackMessage = feedback
    ? feedback.message.startsWith("museo.")
      ? t(feedback.message)
      : feedback.message
    : "";

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-amber-200 shadow-lg">
          <CardHeader>
            <div className="text-6xl mb-2">🏛️</div>
            <CardTitle className="text-3xl text-amber-900">{t("museo.instructions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>{t("museo.instructions.mission")}</p>
            <ol className="text-left space-y-2 list-decimal list-inside">
              <li>{t("museo.instructions.step1")}</li>
              <li>{t("museo.instructions.step2")}</li>
              <li>{t("museo.instructions.step3")}</li>
              <li>{t("museo.instructions.step4")}</li>
            </ol>
          </CardContent>
          <CardFooter className="flex gap-3 justify-center">
            <Button onClick={startGame} size="lg">{t("museo.instructions.start")}</Button>
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
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center border-green-200 shadow-lg">
          <CardHeader>
            <Award size={64} className="text-yellow-500 mx-auto" />
            <CardTitle className="text-3xl text-green-800">{t("museo.completed.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {badge && <Badge variant="warning">{t("museo.completed.badge")}</Badge>}
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
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-red-800">{t("museo.failed.title")}</CardTitle>
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
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-4">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary">⭐ {xp} XP</Badge>
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={18} className={i < lives ? "text-red-500 fill-red-500" : "text-gray-300"} />
            ))}
          </div>
          <Progress value={filledSlots} max={ROUND_SIZE} className="w-28 h-2" indicatorClassName="bg-amber-500" />
          <span className="text-sm text-amber-800">{filledSlots}/{ROUND_SIZE}</span>
        </div>
        <Button onClick={goToDashboard} variant="destructive" size="sm" className="gap-2">
          <Home size={16} />
          {t("common.dashboard")}
        </Button>
      </header>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Clock size={28} />
          {t("museo.title")}
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <section className="mb-8">
            <h2 className="font-semibold text-amber-800 mb-3">{t("museo.timeline")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {timeline.map((eventId, index) => (
                <Droppable droppableId={slotId(index)} key={slotId(index)}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[100px] rounded-lg border-2 border-dashed border-amber-300 bg-white/70 p-2"
                    >
                      <span className="text-xs font-bold text-amber-600">{index + 1}</span>
                      {eventId && eventById[eventId] ? (
                        <Draggable draggableId={eventId} index={0}>
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="mt-1 p-2 rounded-md bg-amber-100 border border-amber-200 text-sm cursor-move"
                            >
                              <div className="font-semibold">{eventById[eventId].title}</div>
                              <div className="text-xs text-amber-700">{formatYear(eventById[eventId].year)}</div>
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <p className="text-xs text-gray-400 mt-4 text-center">{t("museo.emptySlot")}</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-amber-800 mb-3">{t("museo.pool")}</h2>
            <Droppable droppableId={POOL_DROPPABLE_ID} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-2 min-h-[80px] p-3 rounded-lg bg-white/80 border border-amber-200"
                >
                  {poolIds.map((id, index) => {
                    const event = eventById[id];
                    if (!event) return null;
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="px-3 py-2 rounded-md bg-orange-100 border border-orange-200 cursor-move min-w-[140px]"
                          >
                            <div className="font-medium text-sm">{event.title}</div>
                            <div className="text-xs text-orange-700">{formatYear(event.year)}</div>
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
          <Button size="lg" onClick={submitTimeline} className="bg-amber-600 hover:bg-amber-700">
            {t("museo.checkOrder")}
          </Button>
        </div>
      </div>
    </main>
  );
}
