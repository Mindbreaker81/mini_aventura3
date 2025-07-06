import React from "react";
import { Check } from "lucide-react";

interface ProgressStampsProps {
  completedStamps: number;
  total: number;
}

export const ProgressStamps: React.FC<ProgressStampsProps> = ({ completedStamps, total }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex gap-2">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              i < completedStamps
                ? "bg-green-200 border-green-400 text-green-800"
                : "bg-gray-100 border-gray-300 text-gray-500"
            }`}
          >
            {i < completedStamps ? (
              <Check size={16} />
            ) : (
              <span className="text-xs font-bold">{i + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 