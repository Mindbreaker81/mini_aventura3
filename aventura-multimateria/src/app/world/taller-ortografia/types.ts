export type OrtografiaTopic = 'bv' | 'gj' | 'h' | 'tilde' | 'll-y' | 'r-rr';

export interface OrtografiaItem {
  id: number;
  sentence: string;
  options: string[];
  answer: number;
  rule: string;
  topic?: OrtografiaTopic;
}

export const ORTOGRAFIA_ROUND_SIZE = 8;
export const ORTOGRAFIA_INITIAL_HEARTS = 5;
