export type ReciclajeBin = 'amarillo' | 'azul' | 'verde' | 'marron' | 'organico';

export interface ReciclajeItem {
  id: string;
  item: string;
  emoji?: string;
  bin: ReciclajeBin;
  rule: string;
}

export const RECICLAJE_WIN_TARGET = 8;
export const RECICLAJE_ROUND_SIZE = 8;
