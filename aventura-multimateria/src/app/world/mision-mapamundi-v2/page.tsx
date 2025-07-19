"use client";
import React from "react";
import Link from "next/link";
import { Globe, Waves, MapPin, ArrowLeft } from "lucide-react";
import { useTranslation } from "../../components/I18nProvider";

const modes = [
  {
    id: 'continent',
    label: 'Continentes',
    description: 'Localiza los 7 continentes del mundo',
    icon: Globe,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    questions: 7
  },
  {
    id: 'ocean',
    label: 'Océanos',
    description: 'Identifica los 5 océanos principales',
    icon: Waves,
    color: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600',
    questions: 5
  },
  {
    id: 'ccaa',
    label: 'CCAA España',
    description: 'Localiza las 17 comunidades autónomas',
    icon: MapPin,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    questions: 10
  }
];

export default function ModeSelector() {
  const { t } = useTranslation('common');

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800">Misión Mapamundi v2</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Instructions */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-indigo-800 mb-4">
              ¡Elige tu misión geográfica!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selecciona qué quieres practicar: continentes, océanos o comunidades autónomas de España. 
              Cada acierto te dará un sello en tu pasaporte.
            </p>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Link
                  key={mode.id}
                  href={`/world/mision-mapamundi-v2/${mode.id}`}
                  className="group"
                >
                  <div className={`
                    bg-white rounded-2xl shadow-lg p-6 h-full
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-xl
                    border-2 border-transparent hover:border-indigo-200
                  `}>
                    {/* Icon */}
                    <div className={`
                      ${mode.color} ${mode.hoverColor}
                      w-16 h-16 rounded-full flex items-center justify-center
                      mb-4 transition-colors duration-300
                    `}>
                      <IconComponent size={32} className="text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {mode.label}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {mode.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>📋 {mode.questions} preguntas</span>
                      <span>❤️ 5 vidas</span>
                    </div>

                    {/* Badge Preview */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          🏆
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {mode.id === 'continent' && 'Explorador de Continentes'}
                          {mode.id === 'ocean' && 'Explorador de Océanos'}
                          {mode.id === 'ccaa' && 'Explorador de España'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>✨ Cada acierto: +12 XP • Completar misión: +100 XP + Badge</p>
          </div>
        </div>
      </div>
    </main>
  );
} 