"use client";
import dynamic from 'next/dynamic';
import { useTranslation } from '../../components/I18nProvider';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import { useNavigation } from '../../hooks/useNavigation';
import { Home } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ReadingGame = dynamic(() => import('./ReadingGame'), { ssr: false });

export default function BoscLecturaPage() {
  const { t } = useTranslation('common');
  const energy = useBoscLecturaStore((s) => s.energy);
  const showInstructions = useBoscLecturaStore((s) => s.showInstructions);
  const startGame = useBoscLecturaStore((s) => s.startGame);
  const { goToDashboard } = useNavigation();

  // Componente de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-green-200 shadow-lg">
          <CardHeader className="pb-2">
            <div className="text-6xl mb-2">🌲</div>
            <CardTitle className="text-3xl text-green-800">¡Bienvenido al Bosque de Lectura!</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>✨ <strong>Tu misión:</strong> Lee los textos y responde las preguntas para iluminar el bosque mágico.</p>
            
            <Card className="bg-green-50/60 border-green-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-green-800 mb-2">📚 ¿Cómo jugar?</h3>
                <ol className="text-left space-y-2">
                  <li>1. 👀 <strong>Lee</strong> cada texto con mucha atención</li>
                  <li>2. 🤔 <strong>Responde</strong> las preguntas sobre lo que has leído</li>
                  <li>3. ❤️ Tienes <strong>5 corazones</strong> de energía</li>
                  <li>4. ✅ Si respondes bien, ¡ganas puntos!</li>
                  <li>5. ❌ Si fallas, pierdes un corazón</li>
                  <li>6. 🏆 Completa todos los textos para conseguir la medalla</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/60 border-amber-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-amber-800 mb-2">💡 Consejos:</h3>
                <ul className="text-left space-y-1 text-sm">
                  <li>• 🧐 Lee despacio y con atención</li>
                  <li>• 📝 Fíjate en los detalles importantes</li>
                  <li>• 🎯 Algunas preguntas son de Verdadero/Falso</li>
                  <li>• 🔍 Otras tienen varias opciones para elegir</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2">
              <span>❤️❤️❤️❤️❤️</span>
              <span className="text-sm text-muted-foreground">Tienes 5 corazones</span>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center pt-2">
            <Button 
              onClick={startGame}
              size="xl"
              className="bg-green-600 hover:bg-green-700"
            >
              🌟 ¡Empezar la Aventura!
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={20} />
              Inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-green-100/80 border-b border-green-200 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Badge
              key={i}
              variant={i < energy ? "destructive" : "outline"}
              className={i < energy ? "bg-red-500 text-white" : "text-gray-300"}
              aria-label={t('bosc.heart')}
              role="img"
            >
              ❤️
            </Badge>
          ))}
        </div>
        <Button 
          onClick={goToDashboard}
          variant="destructive"
          size="sm"
          className="gap-2"
        >
          <Home size={16} />
          {t('exit')}
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <ReadingGame />
      </main>
    </div>
  );
}
