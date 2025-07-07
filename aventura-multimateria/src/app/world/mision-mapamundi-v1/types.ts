// Tipos para el minijuego Misión Mapamundi

import {
  CCAA_NUM_TO_NAME,
  CCAA_CODE_TO_NAME,
  CCAA_NUM_TO_CODE,
  CCAA_CODE_TO_NUM,
  getCCAAInfo
} from "./ccaaData";

export type TaskType = "CONTINENT" | "OCEAN" | "CCAA";

export interface MapamundiTask {
  id: number;
  type: TaskType;
  question: string;
  targetId: string;
  explanation: string;
}

export interface GameState {
  currentTask: number;
  completedStamps: number;
  hearts: number;
  xp: number;
  tasks: MapamundiTask[];
  selectedRegion: string | null;
  feedback: {
    show: boolean;
    correct: boolean;
    message: string;
  } | null;
  gameStatus: "instructions" | "playing" | "completed" | "failed";
  badge: boolean;
  showInstructions: boolean;
}

export interface MapData {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id: string;
    properties: {
      NAME: string;
      [key: string]: any;
    };
    geometry: any;
  }>;
}

// IDs de continentes para el mapa mundial
export const CONTINENT_IDS = {
  AFRICA: "002",
  ASIA: "142", 
  EUROPE: "150",
  NORTH_AMERICA: "003",
  SOUTH_AMERICA: "005",
  OCEANIA: "009",
  ANTARCTICA: "AQ"
};

// IDs de océanos (simulados como áreas)
export const OCEAN_IDS = {
  ATLANTIC: "ATL",
  PACIFIC: "PAC", 
  INDIAN: "IND",
  ARCTIC: "ARC",
  ANTARCTIC: "ANT"
};

export const CONTINENT_ID_TO_NAME = {
  "002": "Africa",
  "142": "Asia",
  "150": "Europe",
  "003": "North America",
  "005": "South America",
  "009": "Oceania",
  "AQ": "Antarctica"
};

// Mapeo de países (ISO_A2) a código de continente
export const COUNTRY_TO_CONTINENT_ID: Record<string, string> = {
  // América del Norte
  US: "003", CA: "003", MX: "003", GT: "003", CU: "003", HT: "003", DO: "003", HN: "003", NI: "003", SV: "003", CR: "003", PA: "003", BZ: "003", JM: "003", BS: "003", BB: "003", TT: "003", AG: "003", DM: "003", KN: "003", LC: "003", VC: "003", GD: "003",
  // América del Sur
  BR: "005", AR: "005", CO: "005", VE: "005", PE: "005", CL: "005", EC: "005", BO: "005", PY: "005", UY: "005", GY: "005", SR: "005", GF: "005",  
  // Id numérico de Brasil (con y sin ceros a la izquierda)
  "76": "005",
  "076": "005",
  // Europa
  ES: "150", FR: "150", DE: "150", IT: "150", GB: "150", PT: "150", NL: "150", BE: "150", CH: "150", AT: "150", SE: "150", NO: "150", DK: "150", FI: "150", IE: "150", PL: "150", CZ: "150", SK: "150", HU: "150", RO: "150", BG: "150", GR: "150", TR: "150", UA: "150", BY: "150", RU: "150", EE: "150", LV: "150", LT: "150", HR: "150", SI: "150", BA: "150", ME: "150", MK: "150", AL: "150", RS: "150", MD: "150", IS: "150", LU: "150", LI: "150", MC: "150", SM: "150", VA: "150", MT: "150", XK: "150",
  // África
  DZ: "002", AO: "002", BJ: "002", BW: "002", BF: "002", BI: "002", CM: "002", CV: "002", CF: "002", TD: "002", KM: "002", CG: "002", CD: "002", CI: "002", DJ: "002", EG: "002", GQ: "002", ER: "002", SZ: "002", ET: "002", GA: "002", GM: "002", GH: "002", GN: "002", GW: "002", KE: "002", LS: "002", LR: "002", LY: "002", MG: "002", MW: "002", ML: "002", MR: "002", MU: "002", MA: "002", MZ: "002", NA: "002", NE: "002", NG: "002", RW: "002", ST: "002", SN: "002", SC: "002", SL: "002", SO: "002", ZA: "002", SS: "002", SD: "002", TZ: "002", TG: "002", TN: "002", UG: "002", EH: "002", ZM: "002", ZW: "002",
  // Asia
  CN: "142", IN: "142", ID: "142", PK: "142", BD: "142", JP: "142", PH: "142", VN: "142", IR: "142", TH: "142", MM: "142", KR: "142", IQ: "142", SA: "142", UZ: "142", MY: "142", YE: "142",
  // Oceanía
  AU: "009", NZ: "009", FJ: "009", PG: "009", SB: "009", VU: "009", WS: "009", TO: "009", KI: "009", TV: "009", NR: "009", FM: "009", MH: "009", PW: "009", CK: "009", NU: "009", TK: "009", AS: "009", GU: "009", MP: "009", NC: "009", PF: "009", WF: "009",
  // Antártida
  AQ: "AQ",
  // Id numérico de España (con y sin ceros a la izquierda)
  "724": "150",
  "0724": "150",
};