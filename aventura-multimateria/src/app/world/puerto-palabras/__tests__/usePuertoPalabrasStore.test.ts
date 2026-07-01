import { usePuertoPalabrasStore } from '../usePuertoPalabrasStore';
import type { PuertoWord } from '../dragdrop-utils';

const palabrasPrueba: PuertoWord[] = [
  { word: 'gato', category: 'sustantivo', rule: 'Es un nombre de animal' },
  { word: 'correr', category: 'verbo', rule: 'Indica una acción' },
  { word: 'grande', category: 'adjetivo', rule: 'Describe una cualidad' },
  { word: 'rápidamente', category: 'adverbio', rule: 'Modifica un verbo' },
  { word: 'sobre', category: 'preposición', rule: 'Enlaza elementos' },
  { word: 'pero', category: 'conjunción', rule: 'Palabra simple' },
  { word: 'barco', category: 'sustantivo', rule: 'B al inicio' },
  { word: 'nadar', category: 'verbo', rule: 'N inicial' },
];

describe('usePuertoPalabrasStore', () => {
  beforeEach(() => {
    localStorage.clear();
    usePuertoPalabrasStore.getState().resetGame();
    usePuertoPalabrasStore.getState().loadWords(palabrasPrueba);
    usePuertoPalabrasStore.setState({ roundWords: palabrasPrueba, showInstructions: false, gameStatus: 'playing' });
  });

  describe('assignWord', () => {
    it('otorga XP al acierto', () => {
      usePuertoPalabrasStore.getState().assignWord('gato', 'sustantivo');
      const state = usePuertoPalabrasStore.getState();
      expect(state.xp).toBe(10);
      expect(state.repaired).toBe(1);
      expect(state.correctWords).toContain('gato');
    });

    it('no otorga XP en error y permite reintento', () => {
      usePuertoPalabrasStore.getState().assignWord('gato', 'verbo');
      const state = usePuertoPalabrasStore.getState();
      expect(state.xp).toBe(0);
      expect(state.repaired).toBe(0);
      expect(state.assigned['gato']).toBeUndefined();
    });

    it('no duplica XP al reasignar palabra ya correcta', () => {
      usePuertoPalabrasStore.getState().assignWord('gato', 'sustantivo');
      usePuertoPalabrasStore.getState().assignWord('gato', 'sustantivo');
      expect(usePuertoPalabrasStore.getState().xp).toBe(10);
      expect(usePuertoPalabrasStore.getState().repaired).toBe(1);
    });

    it('completa el juego al alcanzar 6 aciertos', () => {
      const words = [
        ['gato', 'sustantivo'],
        ['correr', 'verbo'],
        ['grande', 'adjetivo'],
        ['rápidamente', 'adverbio'],
        ['sobre', 'preposición'],
        ['pero', 'conjunción'],
      ] as const;

      words.forEach(([word, cat]) => {
        usePuertoPalabrasStore.getState().assignWord(word, cat);
      });

      const state = usePuertoPalabrasStore.getState();
      expect(state.gameStatus).toBe('completed');
      expect(state.badge).toBe(true);
      expect(state.repaired).toBe(6);
    });
  });

  describe('startGame', () => {
    it('oculta instrucciones y pasa a playing', () => {
      usePuertoPalabrasStore.setState({ showInstructions: true, gameStatus: 'instructions' });
      usePuertoPalabrasStore.getState().startGame();
      const state = usePuertoPalabrasStore.getState();
      expect(state.showInstructions).toBe(false);
      expect(state.gameStatus).toBe('playing');
    });
  });
});
