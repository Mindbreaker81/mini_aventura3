import React, { useState, useEffect } from "react";
import { SpainMap } from "./SpainMap";

interface MapamundiCCAAProps {
  task: any;
  onResult: (result: { correct: boolean; message: string }) => void;
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
}

// Mapeo de código numérico a nombre de comunidad
const CCAA_NUM_TO_NAME: Record<string, string> = {
  "01": "Andalucía",
  "02": "Aragón",
  "03": "Asturias",
  "04": "Baleares",
  "05": "Canarias",
  "06": "Cantabria",
  "07": "Castilla-Leon",
  "08": "Castilla-La Mancha",
  "09": "Cataluña",
  "10": "Valencia",
  "11": "Extremadura",
  "12": "Galicia",
  "13": "Madrid",
  "14": "Murcia",
  "15": "Navarra",
  "16": "Pais Vasco",
  "17": "La Rioja",
  "18": "Ceuta",
  "19": "Melilla"
};

// Mapeo de código de dos letras a nombre de comunidad
const CCAA_CODE_TO_NAME: Record<string, string> = {
  "AN": "Andalucía",
  "AR": "Aragón",
  "AS": "Asturias",
  "IB": "Baleares",
  "CN": "Canarias",
  "CB": "Cantabria",
  "CL": "Castilla-Leon",
  "CM": "Castilla-La Mancha",
  "CT": "Cataluña",
  "VC": "Valencia",
  "EX": "Extremadura",
  "GA": "Galicia",
  "MD": "Madrid",
  "MC": "Murcia",
  "NC": "Navarra",
  "PV": "Pais Vasco",
  "RI": "La Rioja",
  "CE": "Ceuta",
  "ML": "Melilla"
};

// Mapeo directo de código numérico a código de dos letras para CCAA
const CCAA_NUM_TO_CODE: Record<string, string> = {
  "01": "AN", "02": "AR", "03": "AS", "04": "IB", "05": "CN", "06": "CB",
  "07": "CL", "08": "CM", "09": "CT", "10": "VC", "11": "EX", "12": "GA",
  "13": "MD", "14": "MC", "15": "NC", "16": "PV", "17": "RI", "18": "CE", "19": "ML"
};

// Mapeo de código de dos letras a código numérico para CCAA (usando la lista del usuario)
const CCAA_CODE_TO_NUM: Record<string, string> = {
  AN: "01", AR: "02", AS: "03", IB: "04", CN: "05", CB: "06",
  CL: "07", CM: "08", CT: "09", VC: "10", EX: "11", GA: "12",
  MD: "13", MC: "14", NC: "15", PV: "16", RI: "17", CE: "18", ML: "19"
};

export const MapamundiCCAA: React.FC<MapamundiCCAAProps> = ({
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
    // Convertir ambos valores a código numérico
    const regionKey = String(selectedRegion).padStart(2, "0");
    const expectedNum = CCAA_CODE_TO_NUM[String(task.targetId)] || 'desconocido';
    console.log('[CCAA] Validando:', regionKey, 'vs', expectedNum);
    const correct = regionKey === expectedNum;
    const message = correct
      ? `¡Correcto! Seleccionaste: ${regionKey}. ${task.explanation}`
      : `Incorrecto. Seleccionaste: ${regionKey}. Respuesta correcta: ${expectedNum}. ${task.explanation}`;
    onResult({ correct, message });
  };

  return (
    <div>
      <SpainMap
        targetId={task.targetId}
        onRegionClick={(regionId) => {
          console.log('[CCAA] Seleccionado:', regionId, 'Esperado:', task.targetId);
          onRegionClick(regionId);
        }}
        selectedRegion={selectedRegion}
      />
    </div>
  );
}; 