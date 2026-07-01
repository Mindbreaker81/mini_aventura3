"use client";
import React from "react";
import { useTranslation } from "../../components/I18nProvider";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import { PaymentChallenge } from "./PaymentChallenge";
import { TimeChallenge } from "./TimeChallenge";
import { FractionChallenge } from "./FractionChallenge";
import { ShoppingCart } from "lucide-react";

export const MarketGame: React.FC = () => {
  const { t } = useTranslation("common");
  const { 
    tasks, 
    currentTask, 
    feedback, 
    nextTask, 
    hideFeedback,
    gameStatus,
    completedBaskets
  } = useMercadoNumerosStore();

  if (gameStatus !== "playing" || !tasks.length) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">🛒</div>
        <p className="text-gray-600">{t("mercado.playing.loading")}</p>
      </div>
    );
  }

  const task = tasks[currentTask];
  if (!task) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-gray-600">{t("mercado.playing.allDone")}</p>
      </div>
    );
  }

  const renderChallenge = () => {
    switch (task.type) {
      case "PAGO":
        return <PaymentChallenge task={task} />;
      case "HORA":
        return <TimeChallenge task={task} />;
      case "FRACCION":
        return <FractionChallenge task={task} />;
      default:
        return <div>{t("mercado.playing.unknownType")}</div>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                i < completedBaskets 
                  ? "bg-green-200 border-green-400 text-green-800" 
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              {i < completedBaskets ? (
                <ShoppingCart size={16} />
              ) : (
                <span className="text-xs font-bold">{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-orange-800 mb-2">
            {t("mercado.playing.challengeProgress", { current: currentTask + 1, total: tasks.length })}
          </h2>
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            {task.type === "PAGO" && t("mercado.playing.typePayment")}
            {task.type === "HORA" && t("mercado.playing.typeTime")}
            {task.type === "FRACCION" && t("mercado.playing.typeFraction")}
          </div>
        </div>
        
        {renderChallenge()}
      </div>

      {feedback?.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {feedback.correct ? "🎉" : "😅"}
              </div>
              <div className={`text-lg font-bold mb-2 ${
                feedback.correct ? "text-green-800" : "text-red-800"
              }`}>
                {feedback.correct ? t("mercado.playing.correct") : t("mercado.playing.tryAgain")}
              </div>
              <p className="text-gray-700 mb-4">{t(feedback.message, feedback.params)}</p>
              <button
                onClick={() => {
                  hideFeedback();
                  if (feedback.correct) {
                    nextTask();
                  }
                }}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${
                  feedback.correct 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {feedback.correct ? t("mercado.playing.nextChallenge") : t("mercado.playing.retryChallenge")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
