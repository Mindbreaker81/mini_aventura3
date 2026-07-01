"use client";
import React from "react";
import { useTranslation } from "../../components/I18nProvider";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import type { TimeTask } from "./types";
import { Clock } from "lucide-react";

interface TimeChallengeProps {
  task: TimeTask;
}

export const TimeChallenge: React.FC<TimeChallengeProps> = ({ task }) => {
  const { t } = useTranslation("common");
  const { 
    currentAnswer, 
    selectTimeAnswer, 
    submitTimeAnswer 
  } = useMercadoNumerosStore();

  const timeMatch = task.statement.match(/(\d{1,2}):(\d{2})/);
  const currentTime = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : "16:30";
  
  const ClockSVG = ({ time }: { time: string }) => {
    const [hours, minutes] = time.split(':').map(Number);
    const minuteAngle = (minutes * 6) - 90;
    const hourAngle = ((hours % 12) * 30 + minutes * 0.5) - 90;
    
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto" role="img" aria-label={t("mercado.challenge.time.clockAria", { time })}>
        <title>{t("mercado.challenge.time.clockAria", { time })}</title>
        <circle cx="60" cy="60" r="55" fill="white" stroke="#374151" strokeWidth="3" />
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 60 + 40 * Math.cos(angle);
          const y = 60 + 40 * Math.sin(angle);
          return (
            <text key={num} x={x} y={y + 5} textAnchor="middle" className="text-sm font-bold fill-gray-700">
              {num}
            </text>
          );
        })}
        <line
          x1="60" y1="60"
          x2={60 + 25 * Math.cos(hourAngle * Math.PI / 180)}
          y2={60 + 25 * Math.sin(hourAngle * Math.PI / 180)}
          stroke="#1f2937" strokeWidth="4" strokeLinecap="round"
        />
        <line
          x1="60" y1="60"
          x2={60 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={60 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="#374151" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx="60" cy="60" r="3" fill="#374151" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🕐</div>
        <p className="text-lg text-gray-700 mb-4">{task.statement}</p>
      </div>

      <div className="text-center">
        <h3 className="font-bold text-gray-800 mb-3">
          🕒 {t("mercado.challenge.time.currentTime")}
        </h3>
        <div className="bg-blue-50 rounded-lg p-4 inline-block">
          <ClockSVG time={currentTime} />
          <div className="mt-2 text-xl font-bold text-blue-800">
            {currentTime}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-center">
          ⏰ {t("mercado.challenge.time.timeLeft")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {task.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectTimeAnswer(index)}
              className={`
                p-4 rounded-lg border-2 font-bold text-lg transition-all
                ${currentAnswer === index
                  ? "bg-blue-200 border-blue-500 text-blue-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock size={20} />
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-800 mb-2">💡 {t("mercado.challenge.time.tipTitle")}</h4>
        <p className="text-yellow-700 text-sm">{t("mercado.challenge.time.tip")}</p>
      </div>

      <div className="text-center">
        <button
          onClick={submitTimeAnswer}
          disabled={currentAnswer === null}
          className={`
            px-8 py-3 rounded-lg font-bold text-white text-lg transition-colors
            ${currentAnswer === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          ⏰ {t("mercado.challenge.time.confirm")}
        </button>
      </div>
    </div>
  );
};
