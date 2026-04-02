"use client";
import React from "react";
import { useParams } from "next/navigation";
import MapGame from "../MapGame";
import { GameMode } from "../types";

const validModes: GameMode[] = ['continent', 'ocean', 'ccaa'];

function isValidMode(mode: string): mode is GameMode {
  return (validModes as string[]).includes(mode);
}

export default function GamePage() {
  const params = useParams();
  const mode = params.mode as string;

  // Validar que el modo sea válido
  if (!isValidMode(mode)) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Modo no válido</h1>
          <p className="text-red-600">El modo &quot;{mode}&quot; no está disponible.</p>
        </div>
      </div>
    );
  }

  return <MapGame mode={mode} />;
} 