// Utilidades para drag-and-drop y tipos de datos
export type PuertoWord = {
  word: string;
  category: "sustantivo" | "verbo" | "adjetivo" | "adverbio" | "preposición" | "conjunción";
  rule: string;
};

export const CATEGORIES = [
  { key: "sustantivo", label: "Sustantivo", color: "bg-yellow-200", icon: "book" },
  { key: "verbo", label: "Verbo", color: "bg-green-200", icon: "activity" },
  { key: "adjetivo", label: "Adjetivo", color: "bg-blue-200", icon: "sparkles" },
  { key: "adverbio", label: "Adverbio", color: "bg-purple-200", icon: "timer" },
  { key: "preposición", label: "Preposición", color: "bg-pink-200", icon: "corner-down-right" },
  { key: "conjunción", label: "Conjunción", color: "bg-orange-200", icon: "link" },
];
