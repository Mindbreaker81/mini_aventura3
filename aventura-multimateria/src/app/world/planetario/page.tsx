"use client";

import React from "react";
import Link from "next/link";
import { Orbit, Rocket, ArrowLeft } from "lucide-react";
import { useTranslation } from "../../components/I18nProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MODE_CONFIG } from "./types";

const modeConfig = [
  {
    id: "planetas" as const,
    icon: Orbit,
    color: "bg-violet-500",
    hoverColor: "group-hover:bg-violet-600",
    borderHover: "hover:border-violet-300",
    roundSize: MODE_CONFIG.planetas.roundSize,
  },
  {
    id: "exploracion" as const,
    icon: Rocket,
    color: "bg-indigo-500",
    hoverColor: "group-hover:bg-indigo-600",
    borderHover: "hover:border-indigo-300",
    roundSize: MODE_CONFIG.exploracion.roundSize,
  },
];

export default function PlanetarioModeSelector() {
  const { t } = useTranslation("common");

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-100 flex flex-col">
      <header className="bg-white/80 shadow-sm border-b border-violet-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft size={20} />
              <span>{t("common.dashboard")}</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-violet-900">{t("planetario.title")}</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🪐</div>
            <h2 className="text-3xl font-bold text-violet-900 mb-4">{t("planetario.chooseMission")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("planetario.intro")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modeConfig.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Link key={mode.id} href={`/world/planetario/${mode.id}`} className="group">
                  <Card
                    className={`h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent ${mode.borderHover}`}
                  >
                    <CardHeader className="pb-2">
                      <div
                        className={`${mode.color} ${mode.hoverColor} w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors duration-300`}
                      >
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-800">
                        {t(`planetario.modes.${mode.id}.label`)}
                      </CardTitle>
                      <CardDescription>{t(`planetario.modes.${mode.id}.description`)}</CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          📋 {t("planetario.cards", { count: mode.roundSize })}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ❤️ {t("planetario.lives")}
                        </Badge>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <div className="w-full p-3 bg-violet-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            🏆
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {t(`planetario.modes.${mode.id}.badge`)}
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
