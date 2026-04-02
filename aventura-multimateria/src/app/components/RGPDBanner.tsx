"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "rgpd_accepted";

export default function RGPDBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted) {
        setVisible(true);
      }
    } catch {
      // localStorage not available – don't show banner
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore write errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg
        flex items-center gap-3 rounded-2xl bg-indigo-900/90 px-5 py-3
        text-white text-sm shadow-lg backdrop-blur-sm"
    >
      <span className="text-lg" aria-hidden="true">🔒</span>
      <p className="flex-1 leading-snug">
        Esta aplicación guarda tu progreso en este dispositivo. No recopilamos datos personales.
      </p>
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-xl bg-white/20 px-4 py-1.5 text-sm font-semibold
          transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        Entendido
      </button>
    </div>
  );
}
