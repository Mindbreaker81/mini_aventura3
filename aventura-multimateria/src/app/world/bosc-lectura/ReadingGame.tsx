import { useEffect, useState } from 'react';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import passages from '../../data/bosc-passages.json';
import { useTranslation } from '../../components/I18nProvider';

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
  const [selectedPassages, setSelectedPassages] = useState<Passage[]>([]);

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

  // Selección aleatoria de textos (solo una vez)
  useEffect(() => {
    if (sessionLoaded) {
      const availablePassages = passages as Passage[];
      const maxPassages = Math.min(6, availablePassages.length);
      const shuffledPassages: Passage[] = availablePassages.sort(() => 0.5 - Math.random()).slice(0, maxPassages);
      setSelectedPassages(shuffledPassages);
    }
  }, [sessionLoaded]);

  // Guardar estado en localStorage
  useEffect(() => {
    if (sessionLoaded) {
      localStorage.setItem('bosc-session', JSON.stringify(store));
    }
  }, [store, sessionLoaded]);

  if (!sessionLoaded || selectedPassages.length === 0) return null;

  // Verificar que currentPassage esté dentro del rango válido
  if (store.currentPassage >= selectedPassages.length) {
    // Si se sale del rango, completar el juego
    store.setCompleted();
    if (store.energy > 0) {
      store.addXp(60);
      store.setBadge();
    }
    return (
      <div className="text-center">
        <h2>{t('bosc.completed')}</h2>
        {store.badge && <div className="mt-4">🏅 {t('bosc.badge')}</div>}
        <div className="mt-2">+{store.xp} XP</div>
      </div>
    );
  }
  
  const current = selectedPassages[store.currentPassage];
  
  // Verificar que current y current.questions existan
  if (!current || !current.questions) {
    console.error('Passage data is missing or invalid:', current);
    return (
      <div className="text-center">
        <h2>Error: Datos del pasaje no disponibles</h2>
        <button className="btn mt-4" onClick={store.reset}>Reintentar</button>
      </div>
    );
  }
  
  const currentQuestion = current.questions[step % 2];
  
  // Verificar que la pregunta existe
  if (!currentQuestion) {
    console.error('Question not found for step:', step, 'questions:', current.questions);
    return (
      <div className="text-center">
        <h2>Error: Pregunta no disponible</h2>
        <button className="btn mt-4" onClick={store.reset}>Reintentar</button>
      </div>
    );
  }

  // FLUJO CORRECTO DEL JUEGO:
  // 1. Seleccionar respuesta → Solo actualiza selected
  // 2. Presionar "Comprobar" → Valida la respuesta y muestra feedback
  // 3. Presionar "Siguiente" → Navega al siguiente paso
  const handleAnswer = (value: number | boolean) => {
    console.log('Seleccionando respuesta:', value); // Debug
    setSelected(value);
    // NO llamar a checkAnswer() aquí
    // NO llamar a nextStep() aquí
  };

  const checkAnswer = () => {
    console.log('Comprobando respuesta...'); // Debug
    if (selected === null) {
      console.log('No hay respuesta seleccionada'); // Debug
      return; // No hacer nada si no hay selección
    }
    
    const correct = currentQuestion.answer === selected;
    console.log('Respuesta correcta:', correct); // Debug
    
    store.answer(`${current.id}-${step % 2}`, correct);
    if (correct) {
      store.addXp(10);
      setFeedback({ correct: true, explanation: t('correct') });
    } else {
      store.loseHeart();
      setFeedback({ correct: false, explanation: currentQuestion.explanation });
    }
    setShowFeedback(true);
    // NO llamar a nextStep() aquí
  };

  const nextStep = () => {
    console.log('Pasando al siguiente paso...'); // Debug
    setShowFeedback(false);
    setSelected(null);
    if (step % 2 === 1) {
      // Siguiente texto
      if (store.currentPassage < selectedPassages.length - 1) {
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
