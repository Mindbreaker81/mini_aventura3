"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MapGame from "../MapGame";
import { GameMode } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../../components/I18nProvider";

const validModes: GameMode[] = ['continent', 'ocean', 'ccaa'];

function isValidMode(mode: string): mode is GameMode {
  return (validModes as string[]).includes(mode);
}

export default function GamePage() {
  const { t } = useTranslation('common');
  const params = useParams();
  const mode = params.mode as string;

  // Validar que el modo sea válido
  if (!isValidMode(mode)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl border-0 text-center">
          <CardHeader>
            <div className="text-5xl mb-2">🚫</div>
            <CardTitle className="text-2xl text-red-800">{t('mapamundi.invalidMode.title')}</CardTitle>
            <CardDescription className="text-red-600">
              {t('mapamundi.invalidMode.description', { mode })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              {t('mapamundi.invalidMode.hint')}
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/world/mision-mapamundi-v2" className="gap-2">
                <ArrowLeft size={18} />
                {t('mapamundi.backToMode')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <MapGame mode={mode} />;
}
