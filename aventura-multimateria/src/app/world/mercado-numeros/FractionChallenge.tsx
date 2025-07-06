"use client";
import React from "react";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import type { FractionTask } from "./types";
import { Plus, Minus } from "lucide-react";

interface FractionChallengeProps {
  task: FractionTask;
}

export const FractionChallenge: React.FC<FractionChallengeProps> = ({ task }) => {
  const { 
    currentAnswer, 
    setFractionAnswer, 
    submitFractionAnswer 
  } = useMercadoNumerosStore();

  // Componente para mostrar fracciones de forma visual
  const FractionVisual = ({ numerator, denominator }: { numerator: number; denominator: number }) => {
    if (denominator <= 0) return null;
    
    const parts = Array.from({ length: denominator }, (_, i) => i < numerator);
    
    // Determinar el layout basado en el denominador
    const getLayout = () => {
      if (denominator <= 4) return { cols: denominator, rows: 1 };
      if (denominator <= 8) return { cols: Math.ceil(denominator / 2), rows: 2 };
      if (denominator <= 12) return { cols: Math.ceil(denominator / 3), rows: 3 };
      return { cols: Math.ceil(Math.sqrt(denominator)), rows: Math.ceil(denominator / Math.ceil(Math.sqrt(denominator))) };
    };
    
    const { cols, rows } = getLayout();
    
    return (
      <div className="inline-block bg-white border-2 border-gray-300 rounded-lg p-2">
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
          }}
        >
          {parts.map((filled, index) => (
            <div
              key={index}
              className={`
                w-6 h-6 border border-gray-400 rounded
                ${filled ? 'bg-orange-400' : 'bg-white'}
              `}
            />
          ))}
        </div>
        <div className="text-center mt-2 font-bold text-sm">
          {numerator}/{denominator}
        </div>
      </div>
    );
  };

  // Extraer fracciones del enunciado para mostrar visualmente
  const extractFractions = (text: string) => {
    const fractionRegex = /(\d+)\/(\d+)/g;
    const matches = [...text.matchAll(fractionRegex)];
    return matches.map(match => ({
      numerator: parseInt(match[1]),
      denominator: parseInt(match[2]),
      text: match[0]
    }));
  };

  const fractions = extractFractions(task.statement);

  return (
    <div className="space-y-6">
      {/* Enunciado del problema */}
      <div className="text-center">
        <div className="text-4xl mb-3">🍰</div>
        <p className="text-lg text-gray-700 mb-4">{task.statement}</p>
      </div>

      {/* Visualización de fracciones */}
      {fractions.length > 0 && (
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-3">
            🔍 Visualización:
          </h3>
          <div className="bg-orange-50 rounded-lg p-4 flex flex-wrap justify-center gap-4">
            {fractions.map((fraction, index) => (
              <div key={index} className="text-center">
                <FractionVisual 
                  numerator={fraction.numerator} 
                  denominator={fraction.denominator} 
                />
                <div className="mt-2 text-sm text-gray-600">
                  {fraction.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de respuesta */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-center">
          📝 Tu respuesta:
        </h3>
        
        {task.options ? (
          // Opciones múltiples
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {task.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setFractionAnswer(index)}
                className={`
                  p-4 rounded-lg border-2 font-bold text-lg transition-all
                  ${currentAnswer === index
                    ? "bg-purple-200 border-purple-500 text-purple-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          // Input numérico con botones
          <div className="text-center">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 inline-block">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFractionAnswer(Math.max(0, (currentAnswer || 0) - 1))}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                  disabled={(currentAnswer || 0) <= 0}
                >
                  <Minus size={20} />
                </button>
                
                <div className="text-3xl font-bold text-purple-800 min-w-[60px]">
                  {currentAnswer || 0}
                </div>
                
                <button
                  onClick={() => setFractionAnswer((currentAnswer || 0) + 1)}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                  disabled={(currentAnswer || 0) >= 20}
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Usa los botones + y - para ajustar tu respuesta
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ayuda visual */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-bold text-purple-800 mb-2">💡 Consejo:</h4>
        <p className="text-purple-700 text-sm">
          Una fracción como ½ significa "1 parte de 2 partes iguales". 
          Para sumar fracciones iguales: ¼ + ¼ = 2/4 = ½
        </p>
      </div>

      {/* Botón de envío */}
      <div className="text-center">
        <button
          onClick={submitFractionAnswer}
          disabled={currentAnswer === null}
          className={`
            px-8 py-3 rounded-lg font-bold text-white text-lg transition-colors
            ${currentAnswer === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
            }
          `}
        >
          🍰 Confirmar Respuesta
        </button>
      </div>
    </div>
  );
};