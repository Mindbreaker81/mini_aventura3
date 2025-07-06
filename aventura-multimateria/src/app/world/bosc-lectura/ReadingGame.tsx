import { useEffect, useState } from 'react';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import passages from '../../data/bosc-passages.json';
import { useTranslation } from 'next-i18next';

interface Question {
  q: string;
  type: 'single' | 'true_false';
  options?: string[];
  answer: number | boolean;
  explanation: string;
}

interface Passage {
  id: number;
  title: string;
  paragraph: string;
  questions: Question[];
}

export default function ReadingGame() {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(0); // 0: texto, 1: pregunta1, 2: pregunta2, ...
  const [selected, setSelected] = useState<number | boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [session, setSession] = useState<any>(null);

  const store = useBoscLecturaStore();

  // Cargar estado de localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bosc-session');
    if (saved) {
      const data = JSON.parse(saved);
      setSession(data);
      setSessionLoaded(true);
    } else {
      setSessionLoaded(true);
    }
  }, []);

  // Guardar estado en localStorage
  useEffect(() => {
    if (sessionLoaded) {
      localStorage.setItem('bosc-session', JSON.stringify(store));
    }
  }, [store, sessionLoaded]);

  if (!sessionLoaded) return null;

  // Selección aleatoria de 6 textos
  const selectedPassages: Passage[] = (passages as Passage[]).sort(() => 0.5 - Math.random()).slice(0, 6);
  const current = selectedPassages[store.currentPassage];
  const currentQuestion = current.questions[step % 2];

  const handleAnswer = (value: number | boolean) => {
    setSelected(value);
  };

  const checkAnswer = () => {
    const correct = currentQuestion.answer === selected;
    store.answer(`${current.id}-${step % 2}`, correct);
    if (correct) {
      store.addXp(10);
      setFeedback({ correct: true, explanation: t('correct') });
    } else {
      store.loseHeart();
      setFeedback({ correct: false, explanation: currentQuestion.explanation });
    }
    setShowFeedback(true);
  };

  const nextStep = () => {
    setShowFeedback(false);
    setSelected(null);
    if (step % 2 === 1) {
      // Siguiente texto
      if (store.currentPassage < 5) {
        useBoscLecturaStore.setState((s) => ({ currentPassage: s.currentPassage + 1 }));
        setStep(0);
      } else {
        // Fin del juego
        store.setCompleted();
        if (store.energy > 0) {
          store.addXp(60);
          store.setBadge();
        }
      }
    } else {
      setStep(step + 1);
    }
  };

  if (store.completed) {
    return (
      <div className="text-center">
        <h2>{t('bosc.completed')}</h2>
        {store.badge && <div className="mt-4">🏅 {t('bosc.badge')}</div>}
        <div className="mt-2">+{store.xp} XP</div>
      </div>
    );
  }

  if (store.energy === 0) {
    return (
      <div className="text-center">
        <h2>{t('bosc.failed')}</h2>
        <button className="btn mt-4" onClick={store.reset}>{t('bosc.retry')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">{current.title}</h3>
        <div className="bg-gray-100 rounded p-3 mb-4" tabIndex={0} aria-label={current.paragraph}>{current.paragraph}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">{currentQuestion.q}</div>
        {currentQuestion.type === 'single' && currentQuestion.options && (
          <div role="radiogroup">
            {currentQuestion.options.map((opt, idx) => (
              <label key={idx} className="block mb-1">
                <input
                  type="radio"
                  name="option"
                  value={idx}
                  checked={selected === idx}
                  onChange={() => handleAnswer(idx)}
                  tabIndex={0}
                />{' '}
                {opt}
              </label>
            ))}
          </div>
        )}
        {currentQuestion.type === 'true_false' && (
          <div role="radiogroup">
            {[true, false].map((val, idx) => (
              <label key={idx} className="block mb-1">
                <input
                  type="radio"
                  name="option"
                  value={val ? 'true' : 'false'}
                  checked={selected === val}
                  onChange={() => handleAnswer(val)}
                  tabIndex={0}
                />{' '}
                {t(val ? 'true' : 'false')}
              </label>
            ))}
          </div>
        )}
      </div>
      {showFeedback && (
        <div className={feedback?.correct ? 'text-green-600' : 'text-red-600'} aria-live="polite">
          {feedback?.explanation}
        </div>
      )}
      <button
        className="btn mt-4"
        onClick={showFeedback ? nextStep : checkAnswer}
        disabled={selected === null || showFeedback && !feedback}
        tabIndex={0}
      >
        {showFeedback ? t('next') : t('check')}
      </button>
    </div>
  );
}
