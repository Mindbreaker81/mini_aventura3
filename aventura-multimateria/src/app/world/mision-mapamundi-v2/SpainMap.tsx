"use client";
import React, { useState, useEffect } from "react";
// @ts-ignore
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { MapComponentProps } from "./types";

// URL del TopoJSON de España (CCAA)
const geoUrl = "/ccaa-es.geojson";

// Mapeo de códigos de CCAA
const CCAA_CODES: { [key: string]: string } = {
  "AN": "AN", // Andalucía
  "CT": "CT", // Cataluña
  "MD": "MD", // Madrid
  "VC": "VC", // Comunidad Valenciana
  "GA": "GA", // Galicia
  "CL": "CL", // Castilla y León
  "PV": "PV", // País Vasco
  "CM": "CM", // Castilla-La Mancha
  "MC": "MC", // Murcia
  "AR": "AR", // Aragón
  "EX": "EX", // Extremadura
  "AS": "AS", // Asturias
  "NC": "NC", // Navarra
  "CB": "CB", // Cantabria
  "RI": "RI", // La Rioja
  "IB": "IB", // Islas Baleares
  "CN": "CN"  // Islas Canarias
};

// Mapeo de cod_ccaa a códigos de tarea (MD, AN, etc.)
const COD_CCAA_TO_CODE: { [key: string]: string } = {
  "01": "AN", // Andalucía
  "02": "AR", // Aragón
  "03": "AS", // Asturias
  "04": "IB", // Baleares
  "05": "CN", // Canarias
  "06": "CB", // Cantabria
  "07": "CL", // Castilla-Leon
  "08": "CM", // Castilla-La Mancha
  "09": "CT", // Cataluña
  "10": "VC", // Valencia
  "11": "EX", // Extremadura
  "12": "GA", // Galicia
  "13": "MD", // Madrid
  "14": "MC", // Murcia
  "15": "NC", // Navarra
  "16": "PV", // Pais Vasco
  "17": "RI", // La Rioja
};

export default function SpainMap({ task, selectedRegion, onRegionClick, onResult }: MapComponentProps) {
  const [geography, setGeography] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del mapa
  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((geoData) => {
        setGeography(geoData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading Spain map:", error);
        setLoading(false);
      });
  }, []);

  // Función para manejar clic en región
  const handleRegionClick = (geo: any) => {
    if (!geo || !geo.properties) return;

    // Usar el mapeo para obtener el código de tarea
    const codCcaa = geo.properties.cod_ccaa;
    const regionId = COD_CCAA_TO_CODE[codCcaa];

    if (regionId) {
      onRegionClick(regionId);
    }
  };

  // Función para obtener el estilo de una región
  const getRegionStyle = (geo: any) => {
    if (!geo || !geo.properties) return {};

    const codCcaa = geo.properties.cod_ccaa;
    const regionId = COD_CCAA_TO_CODE[codCcaa];

    const isSelected = selectedRegion === regionId;
    // Eliminadas las pistas visuales (isTarget) para evitar dar la respuesta

    return {
      default: {
        fill: isSelected 
          ? "#3B82F6" 
          : "#E5E7EB",
        stroke: "#FFFFFF",
        strokeWidth: 1,
        outline: "none"
      },
      hover: {
        fill: isSelected 
          ? "#2563EB" 
          : "#D1D5DB",
        stroke: "#FFFFFF",
        strokeWidth: 1,
        outline: "none",
        cursor: "pointer"
      },
      pressed: {
        fill: isSelected 
          ? "#1D4ED8" 
          : "#9CA3AF",
        stroke: "#FFFFFF",
        strokeWidth: 1,
        outline: "none"
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa de España...</p>
        </div>
      </div>
    );
  }

  if (!geography) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🇪🇸</div>
          <p className="text-gray-600">Error al cargar el mapa de España</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Información del modo */}
      <div className="text-center mb-4">
        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          🇪🇸 Haz clic en la comunidad autónoma
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1800,
            center: [-7, 37] // Ajuste para incluir Canarias
          }}
        >
          <ZoomableGroup zoom={1} maxZoom={4} minZoom={0.8}>
            <Geographies geography={geography}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleRegionClick(geo)}
                    style={getRegionStyle(geo)}
                    title={geo.properties?.NAME || geo.properties?.name || "Comunidad Autónoma"}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Leyenda */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>CCAA</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Seleccionado</span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800 text-center">
          <strong>Instrucciones:</strong> Haz clic en la comunidad autónoma correcta y luego confirma tu selección.
        </p>
        <p className="text-xs text-green-700 text-center mt-1">
          España tiene 17 comunidades autónomas y 2 ciudades autónomas
        </p>
        <p className="text-xs text-amber-700 text-center mt-2 italic">
          ⚠️ Nota: Las Islas Canarias han sido reubicadas cerca de la península para facilitar la visualización educativa
        </p>
      </div>
    </div>
  );
} 