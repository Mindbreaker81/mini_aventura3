"use client";
import React from "react";
import { useMisionMapamundiStore } from "./useMisionMapamundiStore";
import { WorldMap } from "./WorldMap";
import { SpainMap } from "./SpainMap";
import { MapPin, Check, X } from "lucide-react";
import { MapamundiCCAA } from "./MapamundiCCAA";
import { MapamundiOcean } from "./MapamundiOcean";
import { MapamundiContinent } from "./MapamundiContinent";
import { FeedbackModal } from "./FeedbackModal";
import { ProgressStamps } from "./ProgressStamps";

export const MapGame: React.FC = () => {
  const { 
    tasks, 
    currentTask, 
    selectedRegion,
    feedback, 
    selectRegion,
    selectContinent,
    selectOcean,
    submitAnswer,
    nextTask, 
    hideFeedback,
    gameStatus,
    completedStamps,
    completeStamp,
    gainXP,
    loseHeart,
    showFeedback
  } = useMisionMapamundiStore();

  const [ccaaGeo, setCcaaGeo] = React.useState<any | null>(null);
  const task = tasks[currentTask];
  if (!task) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-gray-600">¡Misión completada!</p>
      </div>
    );
  }

  React.useEffect(() => {
    if (task && task.type === "CCAA") {
      fetch("/ccaa-es.geojson")
        .then(res => res.json())
        .then(data => setCcaaGeo(data));
    }
  }, [task?.type]);

  const handleRegionClick = (regionId: string) => {
    if (task.type === "CONTINENT") {
      selectContinent(regionId);
    } else if (task.type === "OCEAN") {
      selectOcean(regionId);
    } else {
      selectRegion(regionId);
    }
  };

  const handleSubmit = () => {
    if (selectedRegion) {
      submitAnswer();
    }
  };

  const isContinentSelected = task.type === "CONTINENT" && selectedRegion;

  // Obtener el nombre de la comunidad seleccionada si es pregunta de CCAA
  let selectedCCAAName: string | null = null;
  if (task.type === "CCAA" && selectedRegion && ccaaGeo) {
    const feature = ccaaGeo.features.find((f: any) => f.id === selectedRegion);
    selectedCCAAName = feature ? feature.properties.NAME : selectedRegion;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Progreso de sellos */}
      <ProgressStamps completedStamps={completedStamps} total={10} />

      {/* Pregunta actual */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">
          Misión {currentTask + 1} de {tasks.length}
        </h2>
        <div className="inline-block px-4 py-2 rounded-full text-lg font-medium bg-indigo-100 text-indigo-800">
          {task.type === "CONTINENT" && "🌍 Continente"}
          {task.type === "OCEAN" && "🌊 Océano"}
          {task.type === "CCAA" && "🇪🇸 Comunidad Autónoma"}
        </div>
        <p className="text-xl text-gray-700 mt-4 mb-6">{task.question}</p>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {task.type === "CCAA" ? (
          <MapamundiCCAA
            task={task}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
            selectedCCAAName={selectedCCAAName}
            onResult={({ correct, message }) => {
              if (correct) {
                completeStamp();
                gainXP(12);
                showFeedback(true, message);
              } else {
                loseHeart();
                showFeedback(false, message);
              }
            }}
          />
        ) : task.type === "OCEAN" ? (
          <MapamundiOcean
            task={task}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
            onResult={({ correct, message }) => {
              if (correct) {
                completeStamp();
                gainXP(12);
                showFeedback(true, message);
              } else {
                loseHeart();
                showFeedback(false, message);
              }
            }}
          />
        ) : (
          <MapamundiContinent
            task={task}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
            onResult={({ correct, message }) => {
              if (correct) {
                completeStamp();
                gainXP(12);
                showFeedback(true, message);
              } else {
                loseHeart();
                showFeedback(false, message);
              }
            }}
          />
        )}
      </div>

      {/* Controles */}
      <div className="text-center mb-6">
        {selectedRegion && (
          <div className="mb-4 text-lg">
            <span className="text-gray-600">Región seleccionada: </span>
            <span className="font-bold text-indigo-800">
              {task.type === "CCAA" ? selectedCCAAName : selectedRegion}
            </span>
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!selectedRegion}
          className={`
            px-8 py-3 rounded-lg font-bold text-white text-lg transition-colors
            ${!selectedRegion
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          <MapPin className="inline mr-2" size={20} />
          Confirmar Ubicación
        </button>
      </div>

      {/* Ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-800 mb-2">💡 Consejo:</h4>
        <p className="text-blue-700 text-sm">
          {task.type === "CONTINENT" && "Los continentes son las grandes masas de tierra."}
          {task.type === "OCEAN" && "Los océanos son las grandes extensiones de agua que separan los continentes."}
          {task.type === "CCAA" && "Las comunidades autónomas son las divisiones administrativas de España."}
        </p>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        show={!!feedback?.show}
        correct={!!feedback?.correct}
        message={feedback?.message || ""}
        onClose={() => {
          hideFeedback();
          if (feedback?.correct) {
            nextTask();
          }
        }}
      />
    </div>
  );
};