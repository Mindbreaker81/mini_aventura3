import type { ReciclajeBin } from './types';

export type { ReciclajeItem } from './types';
export { RECICLAJE_WIN_TARGET, RECICLAJE_ROUND_SIZE } from './types';

export const ITEMS_POOL_ID = 'items';

export const BINS: {
  key: ReciclajeBin;
  color: string;
  emoji: string;
}[] = [
  { key: 'amarillo', color: 'bg-yellow-200', emoji: '🟡' },
  { key: 'azul', color: 'bg-blue-200', emoji: '🔵' },
  { key: 'verde', color: 'bg-green-200', emoji: '🟢' },
  { key: 'marron', color: 'bg-amber-700/30', emoji: '🟤' },
  { key: 'organico', color: 'bg-lime-200', emoji: '🍃' },
];
