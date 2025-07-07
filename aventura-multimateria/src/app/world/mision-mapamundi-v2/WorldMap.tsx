"use client";
import React, { useState, useEffect } from "react";
// @ts-ignore
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { MapComponentProps } from "./types";

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

// Mapeo de códigos de océanos (mantener el original)
const OCEAN_CODES: { [key: string]: string } = {
  "ATL": "ATL", // Atlántico
  "PAC": "PAC", // Pacífico
  "IND": "IND", // Índico
  "ARC": "ARC", // Ártico
  "ANT": "ANT"  // Antártico
};

export default function WorldMap({ task, selectedRegion, onRegionClick, onResult }: MapComponentProps) {
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
        console.error("Error loading world map:", error);
        setLoading(false);
      });
  }, []);

  // Determinar si es pregunta de continente o océano
  const isContinentQuestion = task.mode === "continent";
  const isOceanQuestion = task.mode === "ocean";

  // Función para manejar clic en región
  const handleRegionClick = (geo: any) => {
    if (!geo || !geo.properties) return;

    console.log("Geo properties:", geo.properties); // Debug completo

    let regionId = "";
    
    if (isContinentQuestion) {
      // Para continentes, mapear país a continente
      const countryName = geo.properties.name;
      regionId = COUNTRY_TO_CONTINENT[countryName];
      console.log("Country clicked:", countryName, "-> Continent:", regionId); // Debug
    } else if (isOceanQuestion) {
      // Para océanos, usar directamente el código del océano
      regionId = geo.properties.OCEAN || geo.properties.ocean || geo.properties.OCEAN_ID;
      console.log("Ocean clicked, raw code:", regionId); // Debug
    }

    if (regionId) {
      console.log("Calling onRegionClick with:", regionId); // Debug
      onRegionClick(regionId);
    } else {
      console.log("No regionId found for:", geo.properties); // Debug
    }
  };

  // Función para obtener el estilo de una región
  const getRegionStyle = (geo: any) => {
    if (!geo || !geo.properties) return {};

    let regionId = "";
    
    if (isContinentQuestion) {
      const countryName = geo.properties.name;
      regionId = COUNTRY_TO_CONTINENT[countryName];
    } else if (isOceanQuestion) {
      regionId = geo.properties.OCEAN || geo.properties.ocean || geo.properties.OCEAN_ID;
    }

    const isSelected = selectedRegion === regionId;

    return {
      default: {
        fill: isSelected 
          ? "#3B82F6" 
          : "#E5E7EB",
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none"
      },
      hover: {
        fill: isSelected 
          ? "#2563EB" 
          : "#D1D5DB",
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none",
        cursor: "pointer"
      },
      pressed: {
        fill: isSelected 
          ? "#1D4ED8" 
          : "#9CA3AF",
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
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleRegionClick(geo)}
                    style={getRegionStyle(geo)}
                    title={geo.properties?.NAME || geo.properties?.name || "Región"}
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
            <span>Regiones</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Seleccionado</span>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          <strong>Instrucciones:</strong> Haz clic en la región correcta del mapa y luego confirma tu selección.
        </p>
      </div>
    </div>
  );
} 