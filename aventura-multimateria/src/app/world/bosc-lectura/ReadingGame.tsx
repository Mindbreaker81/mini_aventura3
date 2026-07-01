import { useState } from 'react';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import { useTranslation } from '../../components/I18nProvider';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ReadingGame() {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<number | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);

  const store = useBoscLecturaStore();
  const {
    selectedPassages,
    currentPassage,
    currentQuestionIndex,
    energy,
    xp,
    badge,
    completed,
    gameStatus,
    reset,
    loseHeart,
    answer,
    addXp,
    nextQuestion,
  } = store;

  if (selectedPassages.length === 0) {
    return null;
  }

  if (completed || gameStatus === 'completed') {
    return (
      <Card className="max-w-md mx-auto text-center border-green-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-green-800">{t('bosc.completed')}</h2>
          {badge && <div className="text-2xl">🏅 {t('bosc.badge')}</div>}
          <Badge variant="success" className="text-base px-4 py-1">+{xp} XP</Badge>
          <Button variant="outline" onClick={reset}>{t('bosc.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  if (energy === 0 || gameStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardContent className="pt-6 pb-6 space-y-4">
          <h2 className="text-xl font-bold text-red-800">{t('bosc.failed')}</h2>
          <Button variant="destructive" size="lg" onClick={reset}>{t('bosc.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  const current = selectedPassages[currentPassage];
  if (!current?.questions?.length) {
    return (
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-red-800">{t('bosc.playing.errorPassage')}</h2>
          <Button variant="destructive" onClick={reset}>{t('bosc.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = current.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-red-800">{t('bosc.playing.errorQuestion')}</h2>
          <Button variant="destructive" onClick={reset}>{t('bosc.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  const questionId = `${current.id}-${currentQuestionIndex}`;

  const handleAnswer = (value: number | boolean) => {
    setSelected(value);
  };

  const checkAnswer = () => {
    if (selected === null) return;

    const correct = currentQuestion.answer === selected;
    answer(questionId, correct);

    if (correct) {
      addXp(10);
      setFeedback({ correct: true, explanation: t('common.correct') });
    } else {
      loseHeart();
      setFeedback({ correct: false, explanation: currentQuestion.explanation });
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    setFeedback(null);
    nextQuestion();
  };

  const totalQuestions = selectedPassages.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredBefore = selectedPassages
    .slice(0, currentPassage)
    .reduce((sum, p) => sum + p.questions.length, 0);
  const progressValue = answeredBefore + currentQuestionIndex;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          📖 {currentPassage + 1}/{selectedPassages.length}
        </Badge>
        <Progress value={progressValue} max={totalQuestions} className="h-2 flex-1" indicatorClassName="bg-green-500" />
        <Badge variant="success" className="text-xs">⭐ {xp} XP</Badge>
      </div>

      <Card className="border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-green-800">📚 {current.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50/50 rounded-lg p-4 text-gray-700 leading-relaxed border border-green-100" aria-label={current.paragraph}>
            {current.paragraph}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="pt-4 pb-4">
          <fieldset className="border-none p-0 m-0">
            <legend className="font-semibold mb-3 text-blue-800">❓ {currentQuestion.q}</legend>
            {currentQuestion.type === 'single' && currentQuestion.options && (
              <div role="radiogroup" aria-label={currentQuestion.q} className="space-y-2">
                {currentQuestion.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected === idx ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={idx}
                      checked={selected === idx}
                      onChange={() => handleAnswer(idx)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {currentQuestion.type === 'true_false' && (
              <div role="radiogroup" aria-label={currentQuestion.q} className="space-y-2">
                {[true, false].map((val) => (
                  <label
                    key={String(val)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected === val ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      checked={selected === val}
                      onChange={() => handleAnswer(val)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{t(val ? 'bosc.true' : 'bosc.false')}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </CardContent>
      </Card>

      {showFeedback && feedback && (
        <Card className={feedback.correct ? "border-green-300 bg-green-50/80" : "border-red-300 bg-red-50/80"}>
          <CardContent className="pt-4 pb-4" aria-live="polite">
            <span className={feedback.correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
              {feedback.correct ? '✅ ' : '❌ '}{feedback.explanation}
            </span>
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={showFeedback ? handleNext : checkAnswer}
        disabled={selected === null}
      >
        {showFeedback ? `➡️ ${t('bosc.next')}` : `🔍 ${t('bosc.check')}`}
      </Button>
    </div>
  );
}
