"use client";
import dynamic from 'next/dynamic';
import { useTranslation } from '../../components/I18nProvider';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import { useNavigation } from '../../hooks/useNavigation';
import type { BoscPassage } from './useBoscLecturaStore';
import { useGameData } from '../../hooks/useGameData';
import { Home } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ReadingGame = dynamic(() => import('./ReadingGame'), { ssr: false });

export default function BoscLecturaPage() {
  const { t } = useTranslation('common');
  const energy = useBoscLecturaStore((s) => s.energy);
  const showInstructions = useBoscLecturaStore((s) => s.showInstructions);
  const initializeGame = useBoscLecturaStore((s) => s.initializeGame);
  const { goToDashboard } = useNavigation();
  const passagesData = useGameData('bosc-passages');

  const handleStart = () => {
    initializeGame(passagesData as BoscPassage[]);
  };

  // Componente de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-green-200 shadow-lg">
          <CardHeader className="pb-2">
            <div className="text-6xl mb-2">🌲</div>
            <CardTitle className="text-3xl text-green-800">{t('bosc.instructions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>✨ {t('bosc.instructions.mission')}</p>
            
            <Card className="bg-green-50/60 border-green-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-green-800 mb-2">📚 {t('bosc.instructions.howToPlay')}</h3>
                <ol className="text-left space-y-2">
                  <li>1. 👀 {t('bosc.instructions.step1')}</li>
                  <li>2. 🤔 {t('bosc.instructions.step2')}</li>
                  <li>3. ❤️ {t('bosc.instructions.step3')}</li>
                  <li>4. ✅ {t('bosc.instructions.step4')}</li>
                  <li>5. ❌ {t('bosc.instructions.step5')}</li>
                  <li>6. 🏆 {t('bosc.instructions.step6')}</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/60 border-amber-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-amber-800 mb-2">💡 {t('bosc.instructions.tipsTitle')}</h3>
                <ul className="text-left space-y-1 text-sm">
                  <li>• 🧐 {t('bosc.instructions.tip1')}</li>
                  <li>• 📝 {t('bosc.instructions.tip2')}</li>
                  <li>• 🎯 {t('bosc.instructions.tip3')}</li>
                  <li>• 🔍 {t('bosc.instructions.tip4')}</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2">
              <span>❤️❤️❤️❤️❤️</span>
              <span className="text-sm text-muted-foreground">{t('bosc.instructions.heartsLabel')}</span>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center pt-2">
            <Button 
              onClick={handleStart}
              size="xl"
              className="bg-green-600 hover:bg-green-700"
            >
              🌟 {t('bosc.instructions.start')}
            </Button>
            <Button 
              onClick={goToDashboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home size={20} />
              {t('common.home')}
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
          {t('common.exit')}
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <ReadingGame />
      </main>
    </div>
  );
}
