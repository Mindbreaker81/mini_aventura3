import esBoscPassages from './locales/es/bosc-passages.json';
import esMercadoTasks from './locales/es/mercado-tasks.json';
import esFlipLessons from './locales/es/flip-lessons.json';
import esMapamundiTasks from './locales/es/mapamundi-tasks.json';
import esMuseoEvents from './locales/es/museo-events.json';
import esPuertoWords from './locales/es/puerto-words.json';
import esSteamTasks from './locales/es/steam-tasks.json';

import caBoscPassages from './locales/ca/bosc-passages.json';
import caMercadoTasks from './locales/ca/mercado-tasks.json';
import caFlipLessons from './locales/ca/flip-lessons.json';
import caMapamundiTasks from './locales/ca/mapamundi-tasks.json';
import caMuseoEvents from './locales/ca/museo-events.json';
import caPuertoWords from './locales/ca/puerto-words.json';
import caSteamTasks from './locales/ca/steam-tasks.json';

import enBoscPassages from './locales/en/bosc-passages.json';
import enMercadoTasks from './locales/en/mercado-tasks.json';
import enFlipLessons from './locales/en/flip-lessons.json';
import enMapamundiTasks from './locales/en/mapamundi-tasks.json';
import enMuseoEvents from './locales/en/museo-events.json';
import enPuertoWords from './locales/en/puerto-words.json';
import enSteamTasks from './locales/en/steam-tasks.json';

export type GameDataLocale = 'es' | 'ca' | 'en';

export const GAME_DATA_KEYS = [
  'bosc-passages',
  'mercado-tasks',
  'flip-lessons',
  'mapamundi-tasks',
  'museo-events',
  'puerto-words',
  'steam-tasks',
] as const;

export type GameDataKey = (typeof GAME_DATA_KEYS)[number];

const registry = {
  es: {
    'bosc-passages': esBoscPassages,
    'mercado-tasks': esMercadoTasks,
    'flip-lessons': esFlipLessons,
    'mapamundi-tasks': esMapamundiTasks,
    'museo-events': esMuseoEvents,
    'puerto-words': esPuertoWords,
    'steam-tasks': esSteamTasks,
  },
  ca: {
    'bosc-passages': caBoscPassages,
    'mercado-tasks': caMercadoTasks,
    'flip-lessons': caFlipLessons,
    'mapamundi-tasks': caMapamundiTasks,
    'museo-events': caMuseoEvents,
    'puerto-words': caPuertoWords,
    'steam-tasks': caSteamTasks,
  },
  en: {
    'bosc-passages': enBoscPassages,
    'mercado-tasks': enMercadoTasks,
    'flip-lessons': enFlipLessons,
    'mapamundi-tasks': enMapamundiTasks,
    'museo-events': enMuseoEvents,
    'puerto-words': enPuertoWords,
    'steam-tasks': enSteamTasks,
  },
} as const;

export function normalizeGameDataLocale(locale: string | undefined): GameDataLocale {
  if (locale === 'ca' || locale === 'en') return locale;
  return 'es';
}

export function getGameData<K extends GameDataKey>(
  locale: string | undefined,
  key: K
): (typeof registry.es)[K] {
  const lang = normalizeGameDataLocale(locale);
  return registry[lang][key] as (typeof registry.es)[K];
}
