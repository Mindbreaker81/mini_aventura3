import { useEffect, useState } from 'react';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import passages from '../../data/bosc-passages.json';
import { useTranslation } from '../../components/I18nProvider';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  const [selectedPassages, setSelectedPassages] = useState<Passage[]>([]);

  const store = useBoscLecturaStore();

  // Cargar estado de localStorage
  useEffect(() => {
    setSessionLoaded(true);
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
      <Card className="max-w-md mx-auto text-center border-green-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-green-800">{t('bosc.completed')}</h2>
          {store.badge && <div className="text-2xl">🏅 {t('bosc.badge')}</div>}
          <Badge variant="success" className="text-base px-4 py-1">+{store.xp} XP</Badge>
        </CardContent>
      </Card>
    );
  }
  
  const current = selectedPassages[store.currentPassage];
  
  // Verificar que current y current.questions existan
  if (!current || !current.questions) {
    console.error('Passage data is missing or invalid:', current);
    return (
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-red-800">Error: Datos del pasaje no disponibles</h2>
          <Button variant="destructive" onClick={store.reset}>Reintentar</Button>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = current.questions[step % 2];
  
  // Verificar que la pregunta existe
  if (!currentQuestion) {
    console.error('Question not found for step:', step, 'questions:', current.questions);
    return (
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-red-800">Error: Pregunta no disponible</h2>
          <Button variant="destructive" onClick={store.reset}>Reintentar</Button>
        </CardContent>
      </Card>
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
      <Card className="max-w-md mx-auto text-center border-green-200">
        <CardContent className="pt-6 pb-6 space-y-3">
          <h2 className="text-xl font-bold text-green-800">{t('bosc.completed')}</h2>
          {store.badge && <div className="text-2xl">🏅 {t('bosc.badge')}</div>}
          <Badge variant="success" className="text-base px-4 py-1">+{store.xp} XP</Badge>
        </CardContent>
      </Card>
    );
  }

  if (store.energy === 0) {
    return (
      <Card className="max-w-md mx-auto text-center border-red-200">
        <CardContent className="pt-6 pb-6 space-y-4">
          <h2 className="text-xl font-bold text-red-800">{t('bosc.failed')}</h2>
          <Button variant="destructive" size="lg" onClick={store.reset}>{t('bosc.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  const progressValue = store.currentPassage * 2 + (step % 2);
  const progressMax = selectedPassages.length * 2;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          📖 {store.currentPassage + 1}/{selectedPassages.length}
        </Badge>
        <Progress value={progressValue} max={progressMax} className="h-2 flex-1" indicatorClassName="bg-green-500" />
        <Badge variant="success" className="text-xs">
          ⭐ {store.xp} XP
        </Badge>
      </div>

      {/* Passage card */}
      <Card className="border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-green-800">📚 {current.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50/50 rounded-lg p-4 text-gray-700 leading-relaxed border border-green-100" tabIndex={0} aria-label={current.paragraph}>
            {current.paragraph}
          </div>
        </CardContent>
      </Card>

      {/* Question card */}
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
                      selected === idx
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={idx}
                      checked={selected === idx}
                      onChange={() => handleAnswer(idx)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAnswer(idx); } }}
                      tabIndex={0}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {currentQuestion.type === 'true_false' && (
              <div role="radiogroup" aria-label={currentQuestion.q} className="space-y-2">
                {[true, false].map((val, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected === val
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={val ? 'true' : 'false'}
                      checked={selected === val}
                      onChange={() => handleAnswer(val)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAnswer(val); } }}
                      tabIndex={0}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{t(val ? 'true' : 'false')}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </CardContent>
      </Card>

      {/* Feedback */}
      {showFeedback && (
        <Card className={feedback?.correct ? "border-green-300 bg-green-50/80" : "border-red-300 bg-red-50/80"}>
          <CardContent className="pt-4 pb-4" aria-live="polite">
            <span className={feedback?.correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
              {feedback?.correct ? '✅ ' : '❌ '}{feedback?.explanation}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Action button */}
      <Button
        className="w-full"
        size="lg"
        onClick={showFeedback ? nextStep : checkAnswer}
        disabled={selected === null || showFeedback && !feedback}
        tabIndex={0}
      >
        {showFeedback ? `➡️ ${t('next')}` : `🔍 ${t('check')}`}
      </Button>
    </div>
  );
}
