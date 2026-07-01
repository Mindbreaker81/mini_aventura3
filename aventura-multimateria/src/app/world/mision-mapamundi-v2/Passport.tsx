import React from "react";
import { useTranslation } from "../../components/I18nProvider";
import { PassportProps } from "./types";

export default function Passport({ completedStamps, totalStamps, mode }: PassportProps) {
  const { t } = useTranslation('common');

  const getModeConfig = () => {
    switch (mode) {
      case "continent":
        return {
          color: "bg-blue-500",
          borderColor: "border-blue-200",
          emoji: "🌍",
          title: t('mapamundi.passport.continent')
        };
      case "ocean":
        return {
          color: "bg-cyan-500",
          borderColor: "border-cyan-200",
          emoji: "🌊",
          title: t('mapamundi.passport.ocean')
        };
      case "ccaa":
        return {
          color: "bg-green-500",
          borderColor: "border-green-200",
          emoji: "🇪🇸",
          title: t('mapamundi.passport.ccaa')
        };
    }
  };

  const config = getModeConfig();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{config.emoji}</div>
        <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
        <p className="text-sm text-gray-600">
          {t('mapamundi.passport.progress', { current: completedStamps, total: totalStamps })}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4">
        {Array.from({ length: totalStamps }, (_, index) => {
          const isCompleted = index < completedStamps;
          const isNext = index === completedStamps;
          
          return (
            <div
              key={index}
              className={`
                aspect-square rounded-lg border-2 flex items-center justify-center
                transition-all duration-300 transform
                ${isCompleted 
                  ? `${config.color} text-white border-transparent shadow-md scale-105` 
                  : isNext
                  ? `${config.borderColor} border-dashed bg-gray-50 animate-pulse`
                  : `${config.borderColor} bg-gray-50 text-gray-400`
                }
              `}
            >
              {isCompleted ? (
                <div className="text-center">
                  <div className="text-2xl">🏆</div>
                  <div className="text-xs font-bold">#{index + 1}</div>
                </div>
              ) : isNext ? (
                <div className="text-center">
                  <div className="text-2xl text-gray-400">📋</div>
                  <div className="text-xs text-gray-500">{t('mapamundi.passport.next')}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl">📋</div>
                  <div className="text-xs">#{index + 1}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`${config.color} h-3 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${(completedStamps / totalStamps) * 100}%` }}
        ></div>
      </div>

      <div className="text-center text-sm text-gray-600">
        {completedStamps === totalStamps ? (
          <div className="text-green-600 font-semibold">
            {t('mapamundi.passport.completed')}
          </div>
        ) : completedStamps > 0 ? (
          <div>
            {t('mapamundi.passport.remaining', { count: totalStamps - completedStamps })}
          </div>
        ) : (
          <div>{t('mapamundi.passport.start')}</div>
        )}
      </div>

      {completedStamps === totalStamps && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              🏆
            </div>
            <span className="text-sm font-medium text-yellow-800">
              {t(`mapamundi.modes.${mode}.badge`)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
