"use client";

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useTranslation } from '../../components/I18nProvider';
import { useTallerOrtografiaStore } from './useTallerOrtografiaStore';
import type { OrtografiaItem } from './types';
import { useNavigation } from '../../hooks/useNavigation';
import { useGameSession } from '../../hooks/useGameSession';
import { useGameData } from '../../hooks/useGameData';
import { useReloadGameDataOnLocale } from '../../hooks/useReloadGameDataOnLocale';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const SpellingGame = dynamic(() => import('./SpellingGame'), { ssr: false });

export default function TallerOrtografiaPage() {
  const { t } = useTranslation('common');
  const { goToDashboard } = useNavigation();
  const showInstructions = useTallerOrtografiaStore((s) => s.showInstructions);
  const loadItems = useTallerOrtografiaStore((s) => s.loadItems);
  const startGame = useTallerOrtografiaStore((s) => s.startGame);
  const itemsData = useGameData('taller-ortografia-items');

  const initIfNeeded = useCallback(() => {
    loadItems(itemsData as OrtografiaItem[]);
  }, [loadItems, itemsData]);

  useGameSession(useTallerOrtografiaStore.getState, initIfNeeded);
  useReloadGameDataOnLocale(useTallerOrtografiaStore.getState, initIfNeeded);

  if (showInstructions) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-violet-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center border-indigo-200 shadow-lg">
          <CardHeader className="pb-2">
            <div className="text-6xl mb-2">✏️</div>
            <CardTitle className="text-3xl text-indigo-800">{t('ortografia.instructions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-4">
            <p>🎯 {t('ortografia.instructions.mission')}</p>
            <Card className="bg-indigo-50/60 border-indigo-200">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-bold text-indigo-800 mb-2">📖 {t('ortografia.instructions.howToPlay')}</h3>
                <ol className="text-left space-y-2">
                  <li>1. 📝 {t('ortografia.instructions.step1')}</li>
                  <li>2. 🤔 {t('ortografia.instructions.step2')}</li>
                  <li>3. ❤️ {t('ortografia.instructions.step3')}</li>
                  <li>4. ✅ {t('ortografia.instructions.step4')}</li>
                  <li>5. 🏆 {t('ortografia.instructions.step5')}</li>
                </ol>
              </CardContent>
            </Card>
            <div className="flex items-center justify-center gap-2">
              <span>❤️❤️❤️❤️❤️</span>
              <span className="text-sm text-muted-foreground">{t('ortografia.instructions.heartsLabel')}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center pt-2">
            <Button onClick={startGame} size="xl" className="bg-indigo-600 hover:bg-indigo-700">
              ✏️ {t('ortografia.instructions.start')}
            </Button>
            <Button onClick={goToDashboard} variant="outline" size="lg" className="gap-2">
              <Home size={20} />
              {t('common.home')}
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-violet-100">
      <header className="max-w-xl mx-auto flex justify-end p-4">
        <Button onClick={goToDashboard} variant="destructive" size="sm" className="gap-2">
          <Home size={16} />
          {t('common.backToHome')}
        </Button>
      </header>
      <SpellingGame />
    </main>
  );
}
