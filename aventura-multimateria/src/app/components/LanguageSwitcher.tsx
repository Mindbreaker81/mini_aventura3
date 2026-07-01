'use client';

import React from 'react';
import { useTranslation } from './I18nProvider';

const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'ca', label: 'CA' },
  { code: 'en', label: 'EN' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation('common');
  const current = i18n.language?.split('-')[0] ?? 'es';

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('exploraventura-locale', code);
      document.documentElement.lang = code;
    }
  };

  return (
    <div
      className="flex items-center gap-1 rounded-lg border bg-white/90 p-1 shadow-sm"
      role="group"
      aria-label="Idioma"
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => changeLanguage(code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            current === code
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-pressed={current === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
