"use client";

import React, { createContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation as useI18nTranslation } from 'react-i18next';
import esCommon from '../../../public/locales/es/common.json';
import caCommon from '../../../public/locales/ca/common.json';
import enCommon from '../../../public/locales/en/common.json';

const LOCALE_STORAGE_KEY = 'exploraventura-locale';

function getInitialLocale(): string {
  if (typeof window === 'undefined') return 'es';
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'ca' || stored === 'en' || stored === 'es') return stored;
  return 'es';
}

i18n.use(initReactI18next).init({
  lng: getInitialLocale(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  resources: {
    es: { common: esCommon },
    ca: { common: caCommon },
    en: { common: enCommon },
  },
});

const I18nContext = createContext<typeof i18n | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const locale = getInitialLocale();
    i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
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
