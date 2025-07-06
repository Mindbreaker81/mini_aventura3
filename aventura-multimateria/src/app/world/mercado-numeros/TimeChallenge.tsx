"use client";
import React from "react";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import type { TimeTask } from "./types";
import { Clock } from "lucide-react";

interface TimeChallengeProps {
  task: TimeTask;
}

export const TimeChallenge: React.FC<TimeChallengeProps> = ({ task }) => {
  const { 
    currentAnswer, 
    selectTimeAnswer, 
    submitTimeAnswer 
  } = useMercadoNumerosStore();

  // Extraer las horas del enunciado para mostrar en el reloj
  const timeMatch = task.statement.match(/(\d{1,2}):(\d{2})/);
  const currentTime = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : "16:30";
  
  const ClockSVG = ({ time }: { time: string }) => {
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calcular ángulos para las manecillas
    const minuteAngle = (minutes * 6) - 90; // 6 grados por minuto
    const hourAngle = ((hours % 12) * 30 + minutes * 0.5) - 90; // 30 grados por hora + ajuste por minutos
    
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
        {/* Círculo del reloj */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="white"
          stroke="#374151"
          strokeWidth="3"
        />
        
        {/* Números del reloj */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 60 + 40 * Math.cos(angle);
          const y = 60 + 40 * Math.sin(angle);
          return (
            <text
              key={num}
              x={x}
              y={y + 5}
              textAnchor="middle"
              className="text-sm font-bold fill-gray-700"
            >
              {num}
            </text>
          );
        })}
        
        {/* Manecilla de las horas */}
        <line
          x1="60"
          y1="60"
          x2={60 + 25 * Math.cos(hourAngle * Math.PI / 180)}
          y2={60 + 25 * Math.sin(hourAngle * Math.PI / 180)}
          stroke="#1f2937"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Manecilla de los minutos */}
        <line
          x1="60"
          y1="60"
          x2={60 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={60 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="#374151"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Centro del reloj */}
        <circle cx="60" cy="60" r="3" fill="#374151" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enunciado del problema */}
      <div className="text-center">
        <div className="text-4xl mb-3">🕐</div>
        <p className="text-lg text-gray-700 mb-4">{task.statement}</p>
      </div>

      {/* Reloj analógico */}
      <div className="text-center">
        <h3 className="font-bold text-gray-800 mb-3">
          🕒 Hora actual:
        </h3>
        <div className="bg-blue-50 rounded-lg p-4 inline-block">
          <ClockSVG time={currentTime} />
          <div className="mt-2 text-xl font-bold text-blue-800">
            {currentTime}
          </div>
        </div>
      </div>

      {/* Opciones de respuesta */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-center">
          ⏰ ¿Cuánto tiempo falta?
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

      {/* Ayuda visual */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-800 mb-2">💡 Consejo:</h4>
        <p className="text-yellow-700 text-sm">
          Para calcular el tiempo que falta, cuenta las horas y minutos desde la hora actual 
          hasta la hora de cierre. Recuerda que cada hora tiene 60 minutos.
        </p>
      </div>

      {/* Botón de envío */}
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
          ⏰ Confirmar Respuesta
        </button>
      </div>
    </div>
  );
};