import React, { useEffect, useCallback } from "react";
import { SpainMap } from "./SpainMap";
import {
  CCAA_NUM_TO_NAME,
  CCAA_CODE_TO_NAME,
  CCAA_NUM_TO_CODE,
  CCAA_CODE_TO_NUM,
  getCCAAInfo
} from "./ccaaData";

export interface MapamundiCCAAProps {
  task: any;
  onResult: (result: { correct: boolean; message: string }) => void;
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  exposeHandleSubmit?: (fn: () => void) => void;
}

export const MapamundiCCAA: React.FC<MapamundiCCAAProps> = ({
  task,
  onResult,
  selectedRegion,
  onRegionClick,
  exposeHandleSubmit
}) => {
  useEffect(() => {
    // No hace falta limpiar estado local, el padre lo gestiona
  }, [task]);

  const handleSubmit = useCallback((): void => {
    try {
      if (!selectedRegion) return;
      // Convertir ambos valores a código numérico
      const regionKey = String(selectedRegion).padStart(2, "0");
      const expectedCode = String(task.targetId); // código de dos letras
      const expectedNum = CCAA_CODE_TO_NUM[expectedCode] || 'desconocido';
      const expectedName = CCAA_CODE_TO_NAME[expectedCode] || 'desconocido';
      const selectedName = CCAA_NUM_TO_NAME[regionKey] || 'desconocido';

      const correct = regionKey === expectedNum;
      const message = correct
        ? `¡Correcto! Seleccionaste: ${regionKey} (${selectedName}). ${task.explanation}`
        : `Incorrecto. Seleccionaste: ${regionKey} (${selectedName}). Respuesta correcta: ${expectedNum} (${expectedCode}, ${expectedName}). ${task.explanation}`;
      onResult({ correct, message });
    } catch (err) {
      console.error('[MapamundiCCAA] Error en handleSubmit:', err, { selectedRegion, task });
      throw err;
    }
  }, [selectedRegion, task, onResult]);

  // Exponer handleSubmit al padre si se solicita
  useEffect(() => {
    if (exposeHandleSubmit) {
      exposeHandleSubmit(handleSubmit);
    }
  }, [handleSubmit, exposeHandleSubmit]);

  console.log('[MapamundiCCAA] Render', { selectedRegion, task });

  return (
    <div>
      <SpainMap
        targetId={task.targetId}
        onRegionClick={(regionId: string) => {
          console.log('[CCAA] Seleccionado:', regionId, 'Esperado:', task.targetId);
          onRegionClick(regionId);
        }}
        selectedRegion={selectedRegion}
      />
    </div>
  );
}; 