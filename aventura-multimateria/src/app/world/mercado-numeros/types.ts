// Tipos para el minijuego Mercado de Números

export type TaskType = "PAGO" | "HORA" | "FRACCION";

export interface BaseTask {
  id: number;
  type: TaskType;
  statement: string;
  explanation: string;
}

export interface PaymentTask extends BaseTask {
  type: "PAGO";
  amount: number;
}

export interface TimeTask extends BaseTask {
  type: "HORA";
  options: string[];
  answer: number;
}

export interface FractionTask extends BaseTask {
  type: "FRACCION";
  answer: number;
  options?: string[];
}

export type MercadoTask = PaymentTask | TimeTask | FractionTask;

export interface Coin {
  value: number;
  type: "coin" | "bill";
  color: string;
  label: string;
}

export interface GameState {
  currentTask: number;
  completedBaskets: number;
  hearts: number;
  xp: number;
  tasks: MercadoTask[];
  selectedCoins: number[];
  currentAnswer: number | null;
  feedback: {
    show: boolean;
    correct: boolean;
    message: string;
  } | null;
  gameStatus: "instructions" | "playing" | "completed" | "failed";
  badge: boolean;
}

// Monedas y billetes disponibles
export const AVAILABLE_MONEY: Coin[] = [
  { value: 5, type: "bill", color: "bg-blue-200", label: "5€" },
  { value: 2, type: "bill", color: "bg-purple-200", label: "2€" },
  { value: 1, type: "bill", color: "bg-green-200", label: "1€" },
  { value: 0.5, type: "coin", color: "bg-yellow-200", label: "50c" },
  { value: 0.2, type: "coin", color: "bg-orange-200", label: "20c" },
  { value: 0.1, type: "coin", color: "bg-red-200", label: "10c" },
  { value: 0.05, type: "coin", color: "bg-pink-200", label: "5c" },
];