"use client";

import { useState } from 'react';
import { useTallerOrtografiaStore } from './useTallerOrtografiaStore';
import { useTranslation } from '../../components/I18nProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';
import { ORTOGRAFIA_INITIAL_HEARTS } from './types';

export default function SpellingGame() {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastRule, setLastRule] = useState('');
  const [wasCorrect, setWasCorrect] = useState(false);

  const {
    roundItems,
    currentIndex,
    hearts,
    xp,
    badge,
    gameStatus,
    answerQuestion,
    nextQuestion,
    resetGame,
  } = useTallerOrtografiaStore();

  if (roundItems.length === 0) return null;

  if (gameStatus === 'completed') {
    return (
      <Card className="max-w-md mx-auto text-center border-indigo-200 shadow-lg">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-indigo-800">{t('ortografia.completed.title')}</h2>
          {badge && <div className="text-2xl">🏅 {t('ortografia.completed.badge')}</div>}
          <Badge variant="success" className="text-base px-4 py-1">⭐ {xp} XP</Badge>
          <Button variant="outline" onClick={resetGame}>{t('common.newGame')}</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto text-center border-red-200 shadow-lg">
        <CardContent className="pt-6 pb-6 space-y-4">
          <h2 className="text-xl font-bold text-red-800">{t('ortografia.failed.title')}</h2>
          <Badge variant="secondary">⭐ {xp} XP</Badge>
          <Button variant="destructive" size="lg" onClick={resetGame}>{t('common.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  const current = roundItems[currentIndex];
  if (!current) return null;

  const sentenceParts = current.sentence.split('___');
  const displaySentence =
    sentenceParts.length > 1
      ? `${sentenceParts[0]}_____${sentenceParts.slice(1).join('___')}`
      : current.sentence;

  const checkAnswer = () => {
    if (selected === null) return;
    const result = answerQuestion(selected);
    setWasCorrect(result.correct);
    setLastRule(result.rule);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    setLastRule('');
    nextQuestion();
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {[...Array(ORTOGRAFIA_INITIAL_HEARTS)].map((_, i) => (
            <Heart
              key={i}
              size={18}
              className={i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-300'}
            />
          ))}
        </div>
        <Progress
          value={currentIndex}
          max={roundItems.length}
          className="h-2 flex-1"
          indicatorClassName="bg-indigo-500"
        />
        <Badge variant="success" className="text-xs">⭐ {xp} XP</Badge>
      </div>

      <Card className="border-indigo-200">
        <CardContent className="pt-6 pb-6">
          <p className="text-lg text-gray-800 leading-relaxed mb-4 font-medium">
            ✏️ {displaySentence}
          </p>
          <fieldset className="border-none p-0 m-0">
            <legend className="font-semibold mb-3 text-indigo-800">{t('ortografia.playing.choose')}</legend>
            <div role="radiogroup" className="space-y-2">
              {current.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selected === idx
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="spelling-option"
                    value={idx}
                    checked={selected === idx}
                    onChange={() => setSelected(idx)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      {showFeedback && (
        <Card className={wasCorrect ? 'border-green-300 bg-green-50/80' : 'border-red-300 bg-red-50/80'}>
          <CardContent className="pt-4 pb-4" aria-live="polite">
            <span className={wasCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
              {wasCorrect ? '✅ ' : '❌ '}
              {wasCorrect ? t('ortografia.playing.feedbackCorrect') : t('ortografia.playing.feedbackWrong')}
            </span>
            {!wasCorrect && lastRule && (
              <p className="text-sm text-red-600 mt-1 italic">💡 {lastRule}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        size="lg"
        onClick={showFeedback ? handleNext : checkAnswer}
        disabled={selected === null}
      >
        {showFeedback ? `➡️ ${t('ortografia.playing.next')}` : `🔍 ${t('ortografia.playing.check')}`}
      </Button>
    </div>
  );
}
