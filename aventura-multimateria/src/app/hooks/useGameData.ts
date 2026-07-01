'use client';

import { useMemo } from 'react';
import { useTranslation } from '../components/I18nProvider';
import { getGameData, type GameDataKey } from '../data/gameDataRegistry';

export function useGameData<K extends GameDataKey>(key: K) {
  const { i18n } = useTranslation('common');
  const locale = i18n.language;

  return useMemo(() => getGameData(locale, key), [locale, key]);
}
