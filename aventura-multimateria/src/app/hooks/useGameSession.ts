'use client';

import { useEffect, useRef } from 'react';
import { hasActiveSession, type SessionCheckable } from '../world/shared/gameSession';

/**
 * Inicializa una partida nueva solo si no hay sesión activa persistida.
 * @param getState Función que devuelve el estado actual del store
 * @param initialize Acción que crea una partida nueva (loadWords, initializeGame, etc.)
 */
export function useGameSession<T extends SessionCheckable>(
  getState: () => T,
  initialize: () => void
): void {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!hasActiveSession(getState())) {
      initialize();
    }
  }, [getState, initialize]);
}

/**
 * Variante con comprobación extra (p. ej. modo de Mapamundi).
 */
export function useGameSessionWhen(
  shouldInitialize: () => boolean,
  initialize: () => void
): void {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (shouldInitialize()) {
      initialize();
    }
  }, [shouldInitialize, initialize]);
}
