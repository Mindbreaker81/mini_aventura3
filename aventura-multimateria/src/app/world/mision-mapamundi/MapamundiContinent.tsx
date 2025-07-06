import React, { useState, useEffect } from "react";
import { WorldMap } from "./WorldMap";
import { CONTINENT_ID_TO_NAME, COUNTRY_TO_CONTINENT_ID } from "./types";

interface MapamundiContinentProps {
  task: any;
  onResult: (result: { correct: boolean; message: string }) => void;
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
}

export const MapamundiContinent: React.FC<MapamundiContinentProps> = ({
  task,
  onResult,
  selectedRegion,
  onRegionClick
}) => {
  const [countriesGeo, setCountriesGeo] = useState<any | null>(null);

  useEffect(() => {
    // No hace falta limpiar estado local, el padre lo gestiona
  }, [task]);

  useEffect(() => {
    fetch("/countries.geojson")
      .then(res => res.json())
      .then(data => setCountriesGeo(data));
  }, []);

  const handleSubmit = () => {
    if (!selectedRegion || !countriesGeo) return;
    // Buscar el país seleccionado en el geojson por ISO_A2 o ISO_N3
    const feature = countriesGeo.features.find((f: any) =>
      f.properties.ISO_A2 === selectedRegion ||
      f.properties.ISO_N3 === selectedRegion ||
      f.properties.ISO_N3 === selectedRegion.padStart(3, "0")
    );
    if (!feature) {
      onResult({
        correct: false,
        message: `El país seleccionado (${selectedRegion}) no se encuentra en el geojson. Por favor, avisa al desarrollador.`
      });
      return;
    }
    const continent = feature.properties.CONTINENT;
    const targetContinentName = CONTINENT_ID_TO_NAME[task.targetId];
    const correct = continent === targetContinentName;
    const message = correct
      ? `¡Correcto! ${task.explanation}`
      : `Incorrecto. Seleccionaste: ${feature.properties.NAME} (${continent}). Respuesta correcta: ${targetContinentName}. ${task.explanation}`;
    onResult({ correct, message });
  };

  return (
    <div>
      <WorldMap
        targetId={task.targetId}
        onRegionClick={onRegionClick}
        selectedRegion={selectedRegion}
        highlightContinent={selectedRegion}
      />
    </div>
  );
}; 