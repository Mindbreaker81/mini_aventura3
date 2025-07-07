import React from "react";

interface FeedbackModalProps {
  show: boolean;
  correct: boolean;
  message: string;
  onClose: () => void;
  nextLabel?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  show,
  correct,
  message,
  onClose,
  nextLabel
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">
            {correct ? "🎉" : "😅"}
          </div>
          <div className={`text-lg font-bold mb-2 ${correct ? "text-green-800" : "text-red-800"}`}>
            {correct ? "¡Correcto!" : "¡Inténtalo de nuevo!"}
          </div>
          <p className="text-gray-700 mb-4">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${
              correct ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {nextLabel || (correct ? "Siguiente Misión" : "Volver al Mapa")}
          </button>
        </div>
      </div>
    </div>
  );
}; 