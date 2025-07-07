import React from "react";
import { PassportProps } from "./types";

export default function Passport({ completedStamps, totalStamps, mode }: PassportProps) {
  // Configurar colores y emojis según el modo
  const getModeConfig = () => {
    switch (mode) {
      case "continent":
        return {
          color: "bg-blue-500",
          hoverColor: "hover:bg-blue-600",
          borderColor: "border-blue-200",
          emoji: "🌍",
          title: "Pasaporte de Continentes"
        };
      case "ocean":
        return {
          color: "bg-cyan-500",
          hoverColor: "hover:bg-cyan-600",
          borderColor: "border-cyan-200",
          emoji: "🌊",
          title: "Pasaporte de Océanos"
        };
      case "ccaa":
        return {
          color: "bg-green-500",
          hoverColor: "hover:bg-green-600",
          borderColor: "border-green-200",
          emoji: "🇪🇸",
          title: "Pasaporte de España"
        };
    }
  };

  const config = getModeConfig();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
      {/* Header del pasaporte */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{config.emoji}</div>
        <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
        <p className="text-sm text-gray-600">
          Progreso: {completedStamps} de {totalStamps} sellos
        </p>
      </div>

      {/* Sellos */}
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
                  <div className="text-xs text-gray-500">Próximo</div>
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

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`${config.color} h-3 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${(completedStamps / totalStamps) * 100}%` }}
        ></div>
      </div>

      {/* Información adicional */}
      <div className="text-center text-sm text-gray-600">
        {completedStamps === totalStamps ? (
          <div className="text-green-600 font-semibold">
            🎉 ¡Pasaporte completado! ¡Misión cumplida!
          </div>
        ) : completedStamps > 0 ? (
          <div>
            ¡Excelente progreso! {totalStamps - completedStamps} sellos restantes
          </div>
        ) : (
          <div>
            ¡Comienza tu aventura! Haz clic en las regiones correctas para ganar sellos
          </div>
        )}
      </div>

      {/* Badge preview */}
      {completedStamps === totalStamps && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              🏆
            </div>
            <span className="text-sm font-medium text-yellow-800">
              {mode === "continent" && "Explorador de Continentes"}
              {mode === "ocean" && "Explorador de Océanos"}
              {mode === "ccaa" && "Explorador de España"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 