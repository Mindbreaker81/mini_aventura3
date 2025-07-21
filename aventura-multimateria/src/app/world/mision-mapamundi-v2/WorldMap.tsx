"use client";
import React, { useState, useEffect } from "react";
// @ts-expect-error - react-simple-maps types are not available
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { MapComponentProps } from "./types";
// Añadir import para cargar oceans.geojson
// Quitar import estático de oceansData
// import oceansData from "../../../../public/oceans.geojson";

// URL del TopoJSON mundial
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mapeo de países a continentes
const COUNTRY_TO_CONTINENT: { [key: string]: string } = {
  // África
  "Algeria": "AF", "Angola": "AF", "Benin": "AF", "Botswana": "AF", "Burkina Faso": "AF",
  "Burundi": "AF", "Cameroon": "AF", "Cape Verde": "AF", "Central African Republic": "AF", "Central African Rep.": "AF",
  "Chad": "AF", "Comoros": "AF", "Congo": "AF", "Côte d'Ivoire": "AF", "Democratic Republic of the Congo": "AF",
  "Dem. Rep. Congo": "AF",
  "Djibouti": "AF", "Egypt": "AF", "Equatorial Guinea": "AF", "Eritrea": "AF", "Ethiopia": "AF",
  "Gabon": "AF", "Gambia": "AF", "Ghana": "AF", "Guinea": "AF", "Guinea-Bissau": "AF",
  "Kenya": "AF", "Lesotho": "AF", "Liberia": "AF", "Libya": "AF", "Madagascar": "AF",
  "Malawi": "AF", "Mali": "AF", "Mauritania": "AF", "Mauritius": "AF", "Morocco": "AF",
  "Mozambique": "AF", "Namibia": "AF", "Niger": "AF", "Nigeria": "AF", "Rwanda": "AF",
  "São Tomé and Príncipe": "AF", "Senegal": "AF", "Seychelles": "AF", "Sierra Leone": "AF",
  "Somalia": "AF", "South Africa": "AF", "South Sudan": "AF", "S. Sudan": "AF", "Sudan": "AF", "Tanzania": "AF",
  "Togo": "AF", "Tunisia": "AF", "Uganda": "AF", "Zambia": "AF", "Zimbabwe": "AF",
  "DR Congo": "AF", "Republic of the Congo": "AF",

  // Asia
  "Afghanistan": "AS", "Armenia": "AS", "Azerbaijan": "AS", "Bahrain": "AS", "Bangladesh": "AS",
  "Bhutan": "AS", "Brunei": "AS", "Cambodia": "AS", "China": "AS", "Cyprus": "AS",
  "Georgia": "AS", "India": "AS", "Indonesia": "AS", "Iran": "AS", "Iraq": "AS",
  "Israel": "AS", "Japan": "AS", "Jordan": "AS", "Kazakhstan": "AS", "Kuwait": "AS",
  "Kyrgyzstan": "AS", "Laos": "AS", "Lebanon": "AS", "Malaysia": "AS", "Maldives": "AS",
  "Mongolia": "AS", "Myanmar": "AS", "Nepal": "AS", "North Korea": "AS", "Oman": "AS",
  "Pakistan": "AS", "Palestine": "AS", "Philippines": "AS", "Qatar": "AS", "Russia": "AS",
  "Saudi Arabia": "AS", "Singapore": "AS", "South Korea": "AS", "Sri Lanka": "AS", "Syria": "AS", "Taiwan": "AS",
  "Tajikistan": "AS", "Thailand": "AS", "Timor-Leste": "AS", "Turkey": "AS", "Turkmenistan": "AS",
  "United Arab Emirates": "AS", "Uzbekistan": "AS", "Vietnam": "AS", "Yemen": "AS",
  "Burma": "AS", "East Timor": "AS", "Korea": "AS", "Korea, North": "AS", "Korea, South": "AS",

  // Europa
  "Albania": "EU", "Andorra": "EU", "Austria": "EU", "Belarus": "EU", "Belgium": "EU",
  "Bosnia and Herzegovina": "EU", "Bulgaria": "EU", "Croatia": "EU", "Czech Republic": "EU",
  "Denmark": "EU", "Estonia": "EU", "Finland": "EU", "France": "EU", "Germany": "EU",
  "Greece": "EU", "Hungary": "EU", "Iceland": "EU", "Ireland": "EU", "Italy": "EU",
  "Latvia": "EU", "Liechtenstein": "EU", "Lithuania": "EU", "Luxembourg": "EU", "Malta": "EU",
  "Moldova": "EU", "Monaco": "EU", "Montenegro": "EU", "Netherlands": "EU", "North Macedonia": "EU",
  "Norway": "EU", "Poland": "EU", "Portugal": "EU", "Romania": "EU", 
  "San Marino": "EU", "Serbia": "EU", "Slovakia": "EU", "Slovenia": "EU", "Spain": "EU",
  "Sweden": "EU", "Switzerland": "EU", "Ukraine": "EU", "United Kingdom": "EU", "Vatican City": "EU",
  "Czechia": "EU", "Macedonia": "EU",

  // América del Norte
  "Canada": "NA", "Mexico": "NA", "United States": "NA", "United States of America": "NA", "Greenland": "NA",

  // América del Sur
  "Argentina": "SA", "Bolivia": "SA", "Brazil": "SA", "Chile": "SA", "Colombia": "SA",
  "Ecuador": "SA", "French Guiana": "SA", "Guyana": "SA", "Paraguay": "SA", "Peru": "SA",
  "Suriname": "SA", "Uruguay": "SA", "Venezuela": "SA", "Brasil": "SA",

  // Oceanía
  "Australia": "OC", "Fiji": "OC", "Kiribati": "OC", "Marshall Islands": "OC", "Micronesia": "OC",
  "Nauru": "OC", "New Zealand": "OC", "Palau": "OC", "Papua New Guinea": "OC", "Samoa": "OC",
  "Solomon Islands": "OC", "Tonga": "OC", "Tuvalu": "OC", "Vanuatu": "OC",

  // Antártida
  "Antarctica": "AN"
};


// Centroides de océanos para selección clickeable
const OCEAN_CENTROIDS: { [key: string]: [number, number] } = {
  "ATL": [-30, 20],    // Océano Atlántico - entre América y Europa-África
  "PAC": [-140, 0],    // Océano Pacífico - entre América y Asia
  "IND": [70, -20],    // Océano Índico - entre África, Asia y Oceanía
  "ARC": [0, 75],      // Océano Ártico - Polo Norte
  "ANT": [0, -60]      // Océano Antártico - alrededor de Antártida
};


export default function WorldMap({ task, selectedRegion, onRegionClick }: MapComponentProps) {
  const [geography, setGeography] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  // Determinar si es pregunta de continente o océano
  const isContinentQuestion = task.mode === "continent";
  const isOceanQuestion = task.mode === "ocean";

  // Cargar datos del mapa
  useEffect(() => {
    if (isOceanQuestion) {
      // Para océanos, usar el geojson filtrado
      fetch("/oceans_filtered.geojson")
        .then((res) => res.json())
        .then((data) => {
          setGeography(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando oceans_filtered.geojson:", error);
          setLoading(false);
        });
    } else {
      fetch(geoUrl)
        .then((res) => res.json())
        .then((geoData) => {
          setGeography(geoData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading world map:", error);
          setLoading(false);
        });
    }
  }, [isOceanQuestion]);

  // Función para manejar clic en región
  const handleRegionClick = (geo: { properties?: { name?: string; NAME?: string } }) => {
    if (!geo || !geo.properties) return;

    let regionId = "";
    
    if (isContinentQuestion) {
      // Para continentes, mapear país a continente
      const countryName = geo.properties.name;
      regionId = COUNTRY_TO_CONTINENT[countryName];
    } else if (isOceanQuestion) {
      // Para océanos, usar el nombre o código del geojson
      // oceans.geojson no tiene OCEAN_ID, así que usar 'name' o 'NAME' y mapear a código
      const oceanName = geo.properties.name || geo.properties.NAME;
      // Mapeo de nombre a código
      const OCEAN_NAME_TO_CODE: { [key: string]: string } = {
        "Atlantic Ocean": "ATL",
        "Pacific Ocean": "PAC",
        "Indian Ocean": "IND",
        "Arctic Ocean": "ARC",
        "Southern Ocean": "ANT"
      };
      regionId = OCEAN_NAME_TO_CODE[oceanName] || "";
    }

    if (regionId) {
      onRegionClick(regionId);
    }
  };

  // Función para manejar clic en centroides de océanos
  const handleOceanCentroidClick = (oceanCode: string) => {
    if (isOceanQuestion) {
      onRegionClick(oceanCode);
    }
  };

  // Función para obtener el estilo de una región
  const getRegionStyle = (geo: { properties?: { name?: string; NAME?: string } }) => {
    if (!geo || !geo.properties) return {};

    let regionId = "";
    
    if (isContinentQuestion) {
      const countryName = geo.properties.name;
      regionId = COUNTRY_TO_CONTINENT[countryName];
    } else if (isOceanQuestion) {
      const oceanName = geo.properties.name || geo.properties.NAME;
      const OCEAN_NAME_TO_CODE: { [key: string]: string } = {
        "Atlantic Ocean": "ATL",
        "Pacific Ocean": "PAC",
        "Indian Ocean": "IND",
        "Arctic Ocean": "ARC",
        "Southern Ocean": "ANT"
      };
      regionId = OCEAN_NAME_TO_CODE[oceanName] || "";
    }

    const isSelected = selectedRegion === regionId;

    return {
      default: {
        fill: isSelected 
          ? (isOceanQuestion ? "#06b6d4" : "#3B82F6")
          : (isOceanQuestion ? "#bae6fd" : "#E5E7EB"),
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none"
      },
      hover: {
        fill: isSelected 
          ? (isOceanQuestion ? "#0891b2" : "#2563EB")
          : (isOceanQuestion ? "#67e8f9" : "#D1D5DB"),
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none",
        cursor: "pointer"
      },
      pressed: {
        fill: isSelected 
          ? (isOceanQuestion ? "#155e75" : "#1D4ED8")
          : (isOceanQuestion ? "#38bdf8" : "#9CA3AF"),
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none"
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa mundial...</p>
        </div>
      </div>
    );
  }

  if (!geography) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-gray-600">Error al cargar el mapa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Información del modo */}
      <div className="text-center mb-4">
        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {isContinentQuestion ? "🌍 Haz clic en el continente" : "🌊 Haz clic en el océano"}
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 147,
            center: [0, 0]
          }}
        >
          <ZoomableGroup zoom={1} maxZoom={3} minZoom={0.8}>
            <Geographies geography={geography}>
              {({ geographies }: { geographies: { rsmKey: string; properties?: { name?: string; NAME?: string } }[] }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={isOceanQuestion ? undefined : () => handleRegionClick(geo)}
                    style={isOceanQuestion ? {
                      default: { fill: "#bae6fd", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "#bae6fd", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" },
                      pressed: { fill: "#bae6fd", stroke: "#FFFFFF", strokeWidth: 0.5, outline: "none" }
                    } : getRegionStyle(geo)}
                    title={isOceanQuestion ? (geo.properties.name || geo.properties.NAME) : (geo.properties?.NAME || geo.properties?.name || "Región")}
                  />
                ))
              }
            </Geographies>
            
            {/* Centroides clickeables para océanos */}
            {isOceanQuestion && (
              <>
                {Object.entries(OCEAN_CENTROIDS).map(([oceanCode, [lng, lat]]) => (
                  <Marker key={oceanCode} coordinates={[lng, lat]}>
                    <g>
                      {/* Círculo principal */}
                      <circle
                        r="12"
                        fill={selectedRegion === oceanCode ? "#1e40af" : "#3b82f6"}
                        stroke="#ffffff"
                        strokeWidth="3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOceanCentroidClick(oceanCode)}
                      />
                      
                      {/* Efecto hover */}
                      <circle
                        r="18"
                        fill="transparent"
                        stroke={selectedRegion === oceanCode ? "#1e40af" : "#3b82f6"}
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        opacity="0.5"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOceanCentroidClick(oceanCode)}
                      />
                      
                    </g>
                  </Marker>
                ))}
              </>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Leyenda */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          {isOceanQuestion ? (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-sky-200 rounded"></div>
                <span>Océanos</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Puntos clickeables</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                <span>Seleccionado</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Regiones</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Seleccionado</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          <strong>Instrucciones:</strong> {isOceanQuestion 
            ? "Haz clic en el punto azul del océano correcto para seleccionarlo." 
            : "Haz clic en la región correcta del mapa y luego confirma tu selección."}
        </p>
      </div>
    </div>
  );
} 