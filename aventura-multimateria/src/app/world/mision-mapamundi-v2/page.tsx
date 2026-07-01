"use client";
import React from "react";
import Link from "next/link";
import { Globe, Waves, MapPin, ArrowLeft } from "lucide-react";
import { useTranslation } from "../../components/I18nProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const modeConfig = [
  {
    id: 'continent' as const,
    icon: Globe,
    color: 'bg-blue-500',
    hoverColor: 'group-hover:bg-blue-600',
    badgeVariant: 'default' as const,
    borderHover: 'hover:border-blue-300',
    questions: 7
  },
  {
    id: 'ocean' as const,
    icon: Waves,
    color: 'bg-cyan-500',
    hoverColor: 'group-hover:bg-cyan-600',
    badgeVariant: 'secondary' as const,
    borderHover: 'hover:border-cyan-300',
    questions: 5
  },
  {
    id: 'ccaa' as const,
    icon: MapPin,
    color: 'bg-green-500',
    hoverColor: 'group-hover:bg-green-600',
    badgeVariant: 'success' as const,
    borderHover: 'hover:border-green-300',
    questions: 10
  }
];

export default function ModeSelector() {
  const { t } = useTranslation('common');

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link 
                href="/"
                className="gap-2"
              >
                <ArrowLeft size={20} />
                <span>{t('common.dashboard')}</span>
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800">{t('mapamundi.title')}</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-indigo-800 mb-4">
              {t('mapamundi.chooseMission')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('mapamundi.intro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modeConfig.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Link
                  key={mode.id}
                  href={`/world/mision-mapamundi-v2/${mode.id}`}
                  className="group"
                >
                  <Card className={`h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent ${mode.borderHover}`}>
                    <CardHeader className="pb-2">
                      <div className={`
                        ${mode.color} ${mode.hoverColor}
                        w-16 h-16 rounded-full flex items-center justify-center
                        mb-2 transition-colors duration-300
                      `}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-800">
                        {t(`mapamundi.modes.${mode.id}.label`)}
                      </CardTitle>
                      <CardDescription>
                        {t(`mapamundi.modes.${mode.id}.description`)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">📋 {t('mapamundi.questions', { count: mode.questions })}</Badge>
                        <Badge variant="outline" className="text-xs">❤️ {t('mapamundi.lives')}</Badge>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <div className="w-full p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            🏆
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {t(`mapamundi.modes.${mode.id}.badge`)}
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              ✨ {t('mapamundi.footer')}
            </Badge>
          </div>
        </div>
      </div>
    </main>
  );
}
