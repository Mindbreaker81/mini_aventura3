'use client';

import { useEffect } from 'react';
import { useTranslation } from '../components/I18nProvider';
import { hasActiveSession, type SessionCheckable } from '../world/shared/gameSession';

/**
 * Recarga datos pedagógicos al cambiar idioma cuando no hay partida activa.
 */
export function useReloadGameDataOnLocale(
  getState: () => SessionCheckable,
  reload: () => void
): void {
  const { i18n } = useTranslation('common');

  useEffect(() => {
    if (!hasActiveSession(getState())) {
      reload();
    }
  }, [i18n.language, getState, reload]);
}
