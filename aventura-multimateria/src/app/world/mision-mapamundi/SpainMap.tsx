"use client";
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import * as d3 from "d3-geo";

const geoUrl = "/ccaa-es.geojson";

interface SpainMapProps {
  targetId: string;
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
}

export const SpainMap: React.FC<SpainMapProps> = ({
  targetId,
  onRegionClick,
  selectedRegion
}) => {
  const projectionConfig = { scale: 2200, center: [-3, 39.8] };
  const [hoveredRegion, setHoveredRegion] = React.useState<string | null>(null);
  const [hoveredName, setHoveredName] = React.useState<string | null>(null);

  return (
    <div className="w-full bg-green-100 rounded-lg p-4">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={projectionConfig}
        width={600}
        height={700}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const regionId = geo.properties.cod_ccaa;
              const regionName = geo.properties.NAME || geo.properties.name;
              const isSelected = selectedRegion === regionId;
              const isHovered = hoveredRegion === regionId;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onRegionClick(regionId)}
                  onMouseEnter={() => { setHoveredRegion(regionId); setHoveredName(regionName); }}
                  onMouseLeave={() => { setHoveredRegion(null); setHoveredName(null); }}
                  style={{
                    default: {
                      fill: isSelected ? "#f59e0b" : isHovered ? "#fde68a" : "#e5e7eb",
                      stroke: "#374151",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer"
                    },
                    hover: {
                      fill: "#fde68a",
                      stroke: "#374151",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer"
                    },
                    pressed: {
                      fill: "#fbbf24",
                      stroke: "#374151",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer"
                    }
                  }}
                >
                  {/* Mostrar el nombre de la comunidad si quieres */}
                  {/* <text>{regionName}</text> */}
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {/* Mostrar el nombre de la comunidad seleccionada o sobre la que se pasa el mouse */}
      {(hoveredName || selectedRegion) && (
        <div className="mt-4 text-center text-lg font-semibold text-green-900">
          {hoveredName || selectedRegion}
        </div>
      )}
    </div>
  );
};