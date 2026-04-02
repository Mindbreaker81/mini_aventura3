"use client";
import React from "react";
import Link from "next/link";
import { Globe, Waves, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const modes = [
  {
    id: 'continent',
    label: 'Continentes',
    description: 'Localiza los 7 continentes del mundo',
    icon: Globe,
    color: 'bg-blue-500',
    hoverColor: 'group-hover:bg-blue-600',
    badgeLabel: '🌍 Explorador de Continentes',
    badgeVariant: 'default' as const,
    borderHover: 'hover:border-blue-300',
    questions: 7
  },
  {
    id: 'ocean',
    label: 'Océanos',
    description: 'Identifica los 5 océanos principales',
    icon: Waves,
    color: 'bg-cyan-500',
    hoverColor: 'group-hover:bg-cyan-600',
    badgeLabel: '🌊 Explorador de Océanos',
    badgeVariant: 'secondary' as const,
    borderHover: 'hover:border-cyan-300',
    questions: 5
  },
  {
    id: 'ccaa',
    label: 'Comunidades de España',
    description: 'Localiza las 17 comunidades autónomas',
    icon: MapPin,
    color: 'bg-green-500',
    hoverColor: 'group-hover:bg-green-600',
    badgeLabel: '🇪🇸 Explorador de España',
    badgeVariant: 'success' as const,
    borderHover: 'hover:border-green-300',
    questions: 10
  }
];

export default function ModeSelector() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link 
                href="/"
                className="gap-2"
              >
                <ArrowLeft size={20} />
                <span>Dashboard</span>
              </Link>
            </Button>
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
                  <Card className={`h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent ${mode.borderHover}`}>
                    <CardHeader className="pb-2">
                      {/* Icon */}
                      <div className={`
                        ${mode.color} ${mode.hoverColor}
                        w-16 h-16 rounded-full flex items-center justify-center
                        mb-2 transition-colors duration-300
                      `}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-800">
                        {mode.label}
                      </CardTitle>
                      <CardDescription>
                        {mode.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">📋 {mode.questions} preguntas</Badge>
                        <Badge variant="outline" className="text-xs">❤️ 5 vidas</Badge>
                      </div>
                    </CardContent>

                    <CardFooter>
                      {/* Badge Preview */}
                      <div className="w-full p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            🏆
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {mode.badgeLabel}
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              ✨ Cada acierto: +12 XP • Completar misión: +100 XP + Badge
            </Badge>
          </div>
        </div>
      </div>
    </main>
  );
}
