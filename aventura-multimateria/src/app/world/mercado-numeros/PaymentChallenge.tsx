"use client";
import React from "react";
import { useMercadoNumerosStore } from "./useMercadoNumerosStore";
import { AVAILABLE_MONEY } from "./types";
import type { PaymentTask } from "./types";
import { Trash2 } from "lucide-react";

interface PaymentChallengeProps {
  task: PaymentTask;
}

export const PaymentChallenge: React.FC<PaymentChallengeProps> = ({ task }) => {
  const { 
    selectedCoins, 
    selectCoin, 
    removeCoin, 
    submitPayment 
  } = useMercadoNumerosStore();

  const total = selectedCoins.reduce((sum, coin) => sum + coin, 0);
  const targetAmount = task.amount;

  const formatAmount = (amount: number) => {
    if (amount >= 1) {
      return `€${amount.toFixed(2)}`;
    } else {
      return `${Math.round(amount * 100)}c`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enunciado del problema */}
      <div className="text-center">
        <div className="text-4xl mb-3">🛍️</div>
        <p className="text-lg text-gray-700 mb-4">{task.statement}</p>
        <div className="text-2xl font-bold text-orange-800">
          Precio: {formatAmount(targetAmount)}
        </div>
      </div>

      {/* Monedas y billetes disponibles */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-center">
          💰 Selecciona monedas y billetes:
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {AVAILABLE_MONEY.map((money) => (
            <button
              key={money.value}
              onClick={() => selectCoin(money.value)}
              className={`
                ${money.color} hover:opacity-80 
                border-2 border-gray-300 rounded-lg p-3 
                text-center font-bold text-gray-800 
                transition-all hover:scale-105 active:scale-95
                ${money.type === 'bill' ? 'h-16' : 'h-16 w-16 rounded-full'}
              `}
              disabled={total + money.value > 10}
            >
              <div className="text-sm">{money.label}</div>
              {money.type === 'bill' && (
                <div className="text-xs mt-1">billete</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Monedas seleccionadas */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-center">
          🧾 Tu pago actual:
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
          {selectedCoins.length === 0 ? (
            <p className="text-gray-500 text-center">
              Selecciona monedas y billetes arriba
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedCoins.map((coin, index) => {
                  const moneyData = AVAILABLE_MONEY.find(m => m.value === coin);
                  return (
                    <div
                      key={index}
                      className={`
                        ${moneyData?.color} border border-gray-400 rounded px-2 py-1 
                        text-sm font-medium flex items-center gap-1
                      `}
                    >
                      <span>{formatAmount(coin)}</span>
                      <button
                        onClick={() => removeCoin(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total:</span>
                  <span className={`font-bold text-lg ${
                    Math.abs(total - targetAmount) < 0.01 
                      ? "text-green-600" 
                      : total > targetAmount 
                        ? "text-red-600" 
                        : "text-orange-600"
                  }`}>
                    {formatAmount(total)}
                  </span>
                </div>
                {Math.abs(total - targetAmount) < 0.01 && (
                  <div className="text-green-600 text-sm mt-1">
                    ✅ ¡Cantidad exacta!
                  </div>
                )}
                {total > targetAmount && (
                  <div className="text-red-600 text-sm mt-1">
                    ❌ Te pasaste por {formatAmount(total - targetAmount)}
                  </div>
                )}
                {total < targetAmount && total > 0 && (
                  <div className="text-orange-600 text-sm mt-1">
                    Faltan {formatAmount(targetAmount - total)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de envío */}
      <div className="text-center">
        <button
          onClick={submitPayment}
          disabled={selectedCoins.length === 0}
          className={`
            px-8 py-3 rounded-lg font-bold text-white text-lg transition-colors
            ${selectedCoins.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
            }
          `}
        >
          💳 Pagar
        </button>
      </div>
    </div>
  );
};