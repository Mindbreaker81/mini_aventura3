"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation as useI18nTranslation } from 'react-i18next';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: {
        common: {
          "correct": "¡Correcto!",
          "bosc": {
            "completed": "¡Felicidades! Has completado el Bosque de Lectura",
            "badge": "¡Has conseguido la medalla del Bosque de Lectura!"
          }
        }
      },
      ca: {
        common: {
          "correct": "Correcte!",
          "bosc": {
            "completed": "Felicitats! Has completat el Bosc de Lectura",
            "badge": "Has aconseguit la medalla del Bosc de Lectura!"
          }
        }
      },
      en: {
        common: {
          "correct": "Correct!",
          "bosc": {
            "completed": "Congratulations! You have completed the Reading Forest",
            "badge": "You have earned the Reading Forest badge!"
          }
        }
      }
    }
  });

const I18nContext = createContext<any>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return <div>{children}</div>;
  }

  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(namespace = 'common') {
  return useI18nTranslation(namespace);
}