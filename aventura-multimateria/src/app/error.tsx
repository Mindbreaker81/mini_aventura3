'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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
      <Card className="max-w-lg w-full shadow-2xl border-0 text-center">
        <CardHeader>
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">😅</span>
          </div>
          <CardTitle className="text-3xl text-blue-800">
            ¡Ups! Algo salió mal
          </CardTitle>
          <CardDescription className="text-lg">
            No te preocupes, estas cosas pasan. ¡Vamos a intentarlo de nuevo!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/">
                <Home size={20} />
                Volver al inicio
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              className="gap-2 border-green-600 text-green-700 hover:bg-green-50"
            >
              <RotateCcw size={20} />
              Intentar de nuevo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
