"use client";
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  BookOpenCheck,
  Gamepad2,
  Calculator,
  MapPin,
  Bot,
  Beaker,
  Landmark,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "./components/I18nProvider";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

const minigames = [
  { code: "puerto-palabras", icon: Gamepad2, path: "/world/puerto-palabras", color: "text-blue-600", bgGradient: "from-blue-500 to-cyan-400", bgLight: "bg-blue-50" },
  { code: "bosc-lectura", icon: BookOpen, path: "/world/bosc-lectura", color: "text-emerald-600", bgGradient: "from-emerald-500 to-green-400", bgLight: "bg-emerald-50" },
  { code: "mercado-numeros", icon: Calculator, path: "/world/mercado-numeros", color: "text-amber-600", bgGradient: "from-amber-500 to-orange-400", bgLight: "bg-amber-50" },
  { code: "mision-mapamundi-v2", icon: MapPin, path: "/world/mision-mapamundi-v2", color: "text-sky-600", bgGradient: "from-sky-500 to-blue-400", bgLight: "bg-sky-50" },
  { code: "desafio-steam", icon: Bot, path: "/world/desafio-steam", color: "text-violet-600", bgGradient: "from-violet-500 to-purple-400", bgLight: "bg-violet-50" },
  { code: "laboratorio-flip", icon: Beaker, path: "/world/laboratorio-flip", color: "text-teal-600", bgGradient: "from-teal-500 to-cyan-400", bgLight: "bg-teal-50" },
  { code: "museo-tiempo", icon: Landmark, path: "/world/museo-tiempo", color: "text-rose-600", bgGradient: "from-rose-500 to-red-400", bgLight: "bg-rose-50" },
] as const;

export default function Dashboard() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpenCheck size={36} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t("dashboard.title")}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            {t("dashboard.subtitle")}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles size={16} className="text-yellow-300" />
            <span className="text-sm text-blue-200">{t("dashboard.cta")}</span>
            <Sparkles size={16} className="text-yellow-300" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {minigames.map((game) => {
            const Icon = game.icon;
            return (
              <Link key={game.code} href={game.path} className="group">
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${game.bgGradient}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${game.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={28} className={game.color} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {t(`games.${game.code}.subject`)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-3 group-hover:text-primary transition-colors">
                      {t(`games.${game.code}.name`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {t(`games.${game.code}.description`)}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className={`ml-auto ${game.color} group-hover:translate-x-1 transition-transform`}>
                      {t("common.play")}
                      <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-muted-foreground">
          {t("dashboard.footer")}
        </div>
      </footer>
    </div>
  );
}
