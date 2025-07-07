// Estructura base de las Comunidades Autónomas
export interface CCAAEntry {
  name: string;
  num: string;
  code: string;
}

export const CCAA_LIST: CCAAEntry[] = [
  { name: "Galicia", num: "12", code: "GA" },
  { name: "Asturias", num: "03", code: "AS" },
  { name: "Cantabria", num: "06", code: "CB" },
  { name: "Castilla-Leon", num: "07", code: "CL" },
  { name: "Pais Vasco", num: "16", code: "PV" },
  { name: "La Rioja", num: "17", code: "RI" },
  { name: "Navarra", num: "15", code: "NC" },
  { name: "Aragón", num: "02", code: "AR" },
  { name: "Cataluña", num: "09", code: "CT" },
  { name: "Valencia", num: "10", code: "VC" },
  { name: "Baleares", num: "04", code: "IB" },
  { name: "Castilla-La Mancha", num: "08", code: "CM" },
  { name: "Madrid", num: "13", code: "MD" },
  { name: "Extremadura", num: "11", code: "EX" },
  { name: "Murcia", num: "14", code: "MC" },
  { name: "Andalucía", num: "01", code: "AN" }
];

// Mapeos automáticos
export const CCAA_NUM_TO_NAME = Object.fromEntries(CCAA_LIST.map(e => [e.num, e.name]));
export const CCAA_CODE_TO_NAME = Object.fromEntries(CCAA_LIST.map(e => [e.code, e.name]));
export const CCAA_NUM_TO_CODE = Object.fromEntries(CCAA_LIST.map(e => [e.num, e.code]));
export const CCAA_CODE_TO_NUM = Object.fromEntries(CCAA_LIST.map(e => [e.code, e.num]));
export const CCAA_NAME_TO_NUM = Object.fromEntries(CCAA_LIST.map(e => [e.name, e.num]));
export const CCAA_NAME_TO_CODE = Object.fromEntries(CCAA_LIST.map(e => [e.name, e.code]));

// Función utilitaria para obtener la info completa de una CCAA
enum CCAAKeyType {
  NUM = 'num',
  CODE = 'code',
  NAME = 'name',
}

export function getCCAAInfo(value: string): CCAAEntry | undefined {
  return CCAA_LIST.find(
    e => e.num === value || e.code === value || e.name.toLowerCase() === value.toLowerCase()
  );
} 