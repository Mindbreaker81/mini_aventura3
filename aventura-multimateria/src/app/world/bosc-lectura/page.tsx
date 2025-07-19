"use client";
import dynamic from 'next/dynamic';
import { useTranslation } from '../../components/I18nProvider';
import { useBoscLecturaStore } from './useBoscLecturaStore';
import { useNavigation } from '../../hooks/useNavigation';
import { Home } from 'lucide-react';

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
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🌲</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">¡Bienvenido al Bosque de Lectura!</h1>
          
          <div className="text-lg text-gray-700 space-y-4 mb-6">
            <p>✨ <strong>Tu misión:</strong> Lee los textos y responde las preguntas para iluminar el bosque mágico.</p>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-2">📚 ¿Cómo jugar?</h3>
              <ol className="text-left space-y-2">
                <li>1. 👀 <strong>Lee</strong> cada texto con mucha atención</li>
                <li>2. 🤔 <strong>Responde</strong> las preguntas sobre lo que has leído</li>
                <li>3. ❤️ Tienes <strong>5 corazones</strong> de energía</li>
                <li>4. ✅ Si respondes bien, ¡ganas puntos!</li>
                <li>5. ❌ Si fallas, pierdes un corazón</li>
                <li>6. 🏆 Completa todos los textos para conseguir la medalla</li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">💡 Consejos:</h3>
              <ul className="text-left space-y-1 text-sm">
                <li>• 🧐 Lee despacio y con atención</li>
                <li>• 📝 Fíjate en los detalles importantes</li>
                <li>• 🎯 Algunas preguntas son de Verdadero/Falso</li>
                <li>• 🔍 Otras tienen varias opciones para elegir</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 text-red-500">
              <span>❤️❤️❤️❤️❤️</span>
              <span className="text-sm text-gray-600">Tienes 5 corazones</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              🌟 ¡Empezar la Aventura!
            </button>
            <button 
              onClick={goToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors flex items-center gap-2"
            >
              <Home size={20} />
              Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-green-200">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} aria-label={t('bosc.heart')} role="img" className={i < energy ? 'text-red-500' : 'text-gray-300'}>❤️</span>
          ))}
        </div>
        <button 
          onClick={goToDashboard}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Home size={16} />
          {t('exit')}
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <ReadingGame />
      </main>
    </div>
  );
}
