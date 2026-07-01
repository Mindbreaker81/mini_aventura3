"use client";
import React, { useCallback } from "react";
import { useTranslation } from "../../components/I18nProvider";
import { usePuertoPalabrasStore } from "./usePuertoPalabrasStore";
import { CATEGORIES, PuertoWord } from "./dragdrop-utils";
import { Book, Activity, Sparkles, Timer, CornerDownRight, Link, Home, Award, RotateCcw } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { useGameSession } from "../../hooks/useGameSession";
import wordsData from "../../data/puerto-words.json";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PuertoPalabrasPage = () => {
  const { t } = useTranslation("common");
  const {
    roundWords,
    assigned,
    correctWords,
    repaired,
    feedback,
    xp,
    badge,
    gameStatus,
    showInstructions,
    loadWords,
    assignWord,
    resetGame,
    startGame,
  } = usePuertoPalabrasStore();
  const { goToDashboard } = useNavigation();

  const initIfNeeded = useCallback(() => {
    loadWords(wordsData as PuertoWord[]);
  }, [loadWords]);

  useGameSession(usePuertoPalabrasStore.getState, initIfNeeded);

  const availableWords = roundWords.filter(
    (w) => !correctWords.includes(w.word)
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    assignWord(result.draggableId, result.destination.droppableId);
  };

  const BarcoSVG = ({ repairedCount }: { repairedCount: number }) => (
    <svg viewBox="0 0 300 180" width="300" height="180" className="mx-auto mb-4" role="img" aria-label="Barco del Puerto de las Palabras">
      <title>Barco del Puerto de las Palabras</title>
      <rect x="60" y="120" width="180" height="40" rx="20" fill={repairedCount >= 1 ? '#8B5C2A' : '#d1d5db'} stroke="#654321" strokeWidth="3" />
      <rect x="100" y="100" width="100" height="20" rx="8" fill={repairedCount >= 2 ? '#deb887' : '#e5e7eb'} stroke="#b45309" strokeWidth="2" />
      <rect x="145" y="40" width="10" height="60" fill={repairedCount >= 3 ? '#a16207' : '#e5e7eb'} stroke="#78350f" strokeWidth="2" />
      <polygon points="150,45 150,100 210,100" fill={repairedCount >= 4 ? '#fef3c7' : '#e5e7eb'} stroke="#f59e0b" strokeWidth="2" />
      <polygon points="150,60 150,100 90,100" fill={repairedCount >= 5 ? '#f1f5f9' : '#e5e7eb'} stroke="#a3a3a3" strokeWidth="2" />
      <rect x="147" y="30" width="14" height="12" fill={repairedCount >= 6 ? '#ef4444' : '#e5e7eb'} stroke="#991b1b" strokeWidth="1" />
    </svg>
  );

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-blue-200 shadow-lg">
          <CardHeader className="pb-2">
            <div className="text-6xl mb-2">🚢</div>
            <CardTitle className="text-3xl text-blue-800">{t("puerto.instructions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>🎯 {t("puerto.instructions.mission")}</p>
            <Card className="bg-blue-50/60 border-blue-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-blue-800 mb-2">📖 {t("puerto.instructions.howToPlay")}</h3>
                <ol className="text-left space-y-2">
                  <li>1. 🖱️ {t("puerto.instructions.step1")}</li>
                  <li>2. 🎯 {t("puerto.instructions.step2")}</li>
                  <li>3. ✅ {t("puerto.instructions.step3")}</li>
                  <li>4. 📚 {t("puerto.instructions.step4")}</li>
                  <li>5. 🏆 {t("puerto.instructions.step5")}</li>
                </ol>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center pt-2">
            <Button onClick={startGame} size="xl">
              🚢 {t("puerto.instructions.start")}
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
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-lg border-green-200">
          <CardHeader>
            <Award size={64} className="text-yellow-500 mx-auto mb-2" />
            <CardTitle className="text-3xl text-green-800">{t("puerto.completed.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BarcoSVG repairedCount={6} />
            {badge && <Badge variant="warning" className="text-base px-4 py-1">{t("puerto.completed.badge")}</Badge>}
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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-100 flex flex-col items-center justify-start p-4">
      <header className="w-full max-w-3xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">⭐ XP: {xp}</Badge>
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <span className="font-semibold text-sm text-muted-foreground whitespace-nowrap">🔧 {t("puerto.playing.ship")}</span>
            <Progress value={repaired} max={6} className="h-3 w-28" indicatorClassName="bg-blue-500" />
            <span className="text-sm font-mono text-blue-700">{repaired}/6</span>
          </div>
        </div>
        <Button onClick={goToDashboard} variant="destructive" size="sm" className="gap-2">
          <Home size={16} />
          {t("common.backToHome")}
        </Button>
      </header>

      <BarcoSVG repairedCount={repaired} />

      <section className="w-full max-w-3xl flex flex-col md:flex-row gap-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="words" direction="horizontal">
            {(provided) => (
              <Card className="flex-1" ref={provided.innerRef} {...provided.droppableProps}>
                <CardContent className="pt-4 pb-4">
                  <h2 className="font-semibold mb-2 text-base">📝 {t("puerto.playing.words")}</h2>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {availableWords.map((w, idx) => (
                      <Draggable key={w.word} draggableId={w.word} index={idx}>
                        {(prov) => (
                          <span
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="cursor-move px-3 py-2 rounded-md bg-blue-100 shadow-sm text-blue-900 font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                            tabIndex={0}
                            role="button"
                            aria-label={w.word}
                          >
                            {w.word}
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
          <div className="flex-1 grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <Droppable droppableId={cat.key} key={cat.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-4 min-h-[80px] flex flex-col items-center justify-start border-2 border-dashed ${cat.color} transition-colors`}
                  >
                    <span className="font-bold mb-2 flex items-center gap-2 text-sm">
                      {cat.icon === "book" && <Book size={18} />}
                      {cat.icon === "activity" && <Activity size={18} />}
                      {cat.icon === "sparkles" && <Sparkles size={18} />}
                      {cat.icon === "timer" && <Timer size={18} />}
                      {cat.icon === "corner-down-right" && <CornerDownRight size={18} />}
                      {cat.icon === "link" && <Link size={18} />}
                      {t(`puerto.categories.${cat.key}`)}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(assigned)
                        .filter(([, c]) => c === cat.key)
                        .map(([word], idx) => (
                          <Draggable key={word} draggableId={word} index={idx}>
                            {(prov) => (
                              <span
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className="px-2 py-1 rounded-md bg-white border text-xs text-gray-700 shadow-sm"
                              >
                                {word}
                              </span>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </section>

      <section className="mt-6 w-full max-w-3xl">
        {feedback && (
          <Card className={feedback.correct ? "border-green-300 bg-green-50/80" : "border-red-300 bg-red-50/80"}>
            <CardContent className="pt-4 pb-4">
              {feedback.correct ? (
                <>
                  <span className="font-bold text-green-800">✅ {t("puerto.playing.feedbackCorrect")} </span>
                  <br />
                  <span className="italic text-green-600 text-sm">💡 {feedback.rule}</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-red-800">🔄 {t("puerto.playing.feedbackRetry")} </span>
                  <span className="italic text-red-600 text-sm">{feedback.rule}</span>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
};

export default PuertoPalabrasPage;
