'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error capturado por el error boundary global:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">😅</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            ¡Ups! Algo salió mal
          </h1>
          <p className="text-gray-600 text-lg">
            No te preocupes, estas cosas pasan. ¡Vamos a intentarlo de nuevo!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Home size={20} />
            Volver al inicio
          </Link>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <RotateCcw size={20} />
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
