import React, { useState, useEffect } from "react";
import { WorldMap } from "./WorldMap";

interface MapamundiOceanProps {
  task: any;
  onResult: (result: { correct: boolean; message: string }) => void;
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
}

export const MapamundiOcean: React.FC<MapamundiOceanProps> = ({
  task,
  onResult,
  selectedRegion,
  onRegionClick
}) => {
  useEffect(() => {
    // No hace falta limpiar estado local, el padre lo gestiona
  }, [task]);

  const handleSubmit = () => {
    if (!selectedRegion) return;
    const correct = selectedRegion === task.targetId;
    const message = correct
      ? `¡Correcto! ${task.explanation}`
      : `Incorrecto. Seleccionaste: ${selectedRegion}. Respuesta correcta: ${task.targetId}. ${task.explanation}`;
    onResult({ correct, message });
  };

  return (
    <div>
      <WorldMap
        targetId={task.targetId}
        onRegionClick={onRegionClick}
        selectedRegion={selectedRegion}
      />
    </div>
  );
}; 