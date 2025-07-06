"use client";
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useMisionMapamundiStore } from "./useMisionMapamundiStore";
import { CONTINENT_IDS } from "./types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json";

// Mapeo de ID de continente a nombre en inglés (como en world-atlas)
const CONTINENT_ID_TO_NAME = {
  "002": "Africa",
  "142": "Asia",
  "150": "Europe",
  "003": "North America",
  "005": "South America",
  "009": "Oceania",
  "AQ": "Antarctica"
};

interface WorldMapProps {
  targetId: string;
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
  highlightContinent?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ 
  targetId, 
  onRegionClick, 
  selectedRegion, 
  highlightContinent
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [oceansData, setOceansData] = useState<any | null>(null);
  const { tasks, currentTask } = useMisionMapamundiStore();
  const currentTaskType = tasks[currentTask]?.type;

  const validContinents = Object.values(CONTINENT_IDS);

  useEffect(() => {
    // Cargar océanos del geojson usando fetch
    fetch("/oceans.geojson")
      .then((res) => res.json())
      .then((data) => setOceansData(data));
  }, []);

  const getRegionColor = (geo: any) => {
    const countryId = geo.properties.ISO_A2 || geo.id;
    if (selectedRegion === countryId) {
      return "#f59e0b";
    }
    if (hoveredRegion === countryId) {
      return "#fbbf24";
    }
    // Colores por continente
    const continent = geo.properties.CONTINENT;
    switch (continent) {
      case "Africa":
        return "#fef3c7";
      case "Asia":
        return "#ddd6fe";
      case "Europe":
        return "#bbf7d0";
      case "North America":
        return "#fed7d7";
      case "South America":
        return "#fecaca";
      case "Oceania":
        return "#bfdbfe";
      case "Antarctica":
        return "#e5e7eb";
      default:
        return "#f3f4f6";
    }
  };

  const handleGeographyClick = (geo: any) => {
    if (currentTaskType === "CONTINENT") {
      let countryId = geo.properties.ISO_A2;
      if (!countryId) {
        countryId = geo.id;
        // Mostrar advertencia si no hay ISO_A2
        if (process.env.NODE_ENV !== "production") {
          console.warn("País sin ISO_A2, usando id numérico:", geo);
        }
      }
      onRegionClick(countryId);
      setHoveredName(geo.properties.NAME);
    } else if (currentTaskType === "OCEAN") {
      onRegionClick(geo.id);
    } else {
      const regionId = geo.properties.ISO_A2 || geo.id;
      onRegionClick(regionId);
    }
  };

  const handleMouseEnter = (geo: any) => {
    if (currentTaskType === "CONTINENT") {
      const countryId = geo.properties.ISO_A2 || geo.id;
      setHoveredRegion(countryId);
      setHoveredName(geo.properties.NAME);
    } else {
      let regionId = geo.properties.ISO_A2 || geo.id;
      setHoveredRegion(regionId);
      setHoveredName(geo.properties.NAME || geo.properties.name || null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setHoveredName(null);
  };

  return (
    <div className="w-full bg-blue-100 rounded-lg overflow-hidden">
      {/* Explicación para preguntas de continente */}
      {currentTaskType === "CONTINENT" && (
        <div className="p-2 text-center text-blue-900 bg-blue-50 border-b border-blue-200 text-sm">
          Selecciona cualquier país dentro del continente solicitado para responder correctamente.
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [0, 20]
        }}
        width={800}
        height={500}
      >
        {/* Solo renderizar países/continentes si NO es modo OCEAN */}
        {currentTaskType !== "OCEAN" && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                let regionId;
                if (currentTaskType === "CONTINENT") {
                  regionId = geo.properties.CONTINENT;
                } else {
                  regionId = geo.properties.ISO_A2 || geo.id;
                }
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleGeographyClick(geo)}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: getRegionColor(geo),
                        stroke: "#374151",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: getRegionColor(geo),
                        stroke: "#374151",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: getRegionColor(geo),
                        stroke: "#374151",
                        strokeWidth: 1,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
        {/* Océanos como shapes */}
        {oceansData && oceansData.features && (
          <Geographies geography={oceansData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const oceanId = geo.id || geo.properties?.id || geo.properties?.name;
                const isSelected = selectedRegion === oceanId;
                const isHovered = hoveredRegion === oceanId;
                return (
                  <Geography
                    key={geo.rsmKey || oceanId}
                    geography={geo}
                    onClick={() => onRegionClick(oceanId)}
                    onMouseEnter={() => setHoveredRegion(oceanId)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    style={{
                      default: {
                        fill: isSelected ? "#38bdf8" : isHovered ? "#bae6fd" : "#e0f2fe",
                        stroke: "#0ea5e9",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        opacity: 0.7
                      },
                      hover: {
                        fill: "#bae6fd",
                        stroke: "#0ea5e9",
                        strokeWidth: 2,
                        outline: "none",
                        cursor: "pointer",
                        opacity: 0.9
                      },
                      pressed: {
                        fill: "#38bdf8",
                        stroke: "#0ea5e9",
                        strokeWidth: 2,
                        outline: "none",
                        opacity: 1
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
      
      {/* Tooltip con información */}
      {hoveredName && (
        <div className="mt-2 text-center text-sm text-gray-600">
          País seleccionado: {hoveredName}
        </div>
      )}
    </div>
  );
};