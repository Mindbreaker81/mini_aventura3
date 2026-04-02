import { usePuertoPalabrasStore } from '../usePuertoPalabrasStore';
import type { PuertoWord } from '../dragdrop-utils';

const palabrasPrueba: PuertoWord[] = [
  { word: 'gato', category: 'sustantivo', rule: 'Es un nombre de animal' },
  { word: 'correr', category: 'verbo', rule: 'Indica una acción' },
  { word: 'grande', category: 'adjetivo', rule: 'Describe una cualidad' },
  { word: 'rápidamente', category: 'adverbio', rule: 'Modifica un verbo' },
  { word: 'sobre', category: 'preposición', rule: 'Enlaza elementos' },
];

describe('usePuertoPalabrasStore', () => {
  beforeEach(() => {
    usePuertoPalabrasStore.getState().reset();
  });

  describe('loadWords - inicialización del juego', () => {
    it('establece el estado inicial correctamente al cargar palabras', () => {
      usePuertoPalabrasStore.getState().loadWords(palabrasPrueba);
      const state = usePuertoPalabrasStore.getState();

      expect(state.words).toHaveLength(5);
      expect(state.roundWords.length).toBeLessThanOrEqual(10);
      expect(state.roundWords.length).toBeGreaterThan(0);
      expect(state.assigned).toEqual({});
      expect(state.repaired).toBe(0);
      expect(state.xp).toBe(0);
      expect(state.badge).toBe(false);
      expect(state.feedback).toBeNull();
    });

    it('deduplica palabras repetidas', () => {
      const conDuplicados: PuertoWord[] = [
        ...palabrasPrueba,
        { word: 'gato', category: 'sustantivo', rule: 'Es un nombre de animal' },
      ];
      usePuertoPalabrasStore.getState().loadWords(conDuplicados);
      const state = usePuertoPalabrasStore.getState();

      expect(state.words).toHaveLength(5);
    });
  });

  describe('assignWord - asignar palabra a categoría', () => {
    beforeEach(() => {
      // Cargar palabras y forzar un set conocido de roundWords
      usePuertoPalabrasStore.getState().loadWords(palabrasPrueba);
      usePuertoPalabrasStore.setState({ roundWords: palabrasPrueba });
    });

    it('otorga XP al asignar una palabra a la categoría correcta', () => {
      usePuertoPalabrasStore.getState().assignWord('gato', 'sustantivo');
      const state = usePuertoPalabrasStore.getState();

      expect(state.xp).toBe(10);
      expect(state.repaired).toBe(1);
      expect(state.feedback).toEqual({
        word: 'gato',
        correct: true,
        rule: 'Es un nombre de animal',
      });
      expect(state.assigned['gato']).toBe('sustantivo');
    });

    it('no otorga XP al asignar una palabra a la categoría incorrecta', () => {
      usePuertoPalabrasStore.getState().assignWord('gato', 'verbo');
      const state = usePuertoPalabrasStore.getState();

      expect(state.xp).toBe(0);
      expect(state.repaired).toBe(0);
      expect(state.feedback).toEqual({
        word: 'gato',
        correct: false,
        rule: 'Es un nombre de animal',
      });
      expect(state.assigned['gato']).toBe('verbo');
    });

    it('acumula XP con múltiples respuestas correctas', () => {
      usePuertoPalabrasStore.getState().assignWord('gato', 'sustantivo');
      usePuertoPalabrasStore.getState().assignWord('correr', 'verbo');
      const state = usePuertoPalabrasStore.getState();

      expect(state.xp).toBe(20);
      expect(state.repaired).toBe(2);
    });
  });

  describe('startGame - iniciar partida', () => {
    it('oculta las instrucciones al iniciar', () => {
      const state = usePuertoPalabrasStore.getState();
      expect(state.showInstructions).toBe(true);

      usePuertoPalabrasStore.getState().startGame();
      expect(usePuertoPalabrasStore.getState().showInstructions).toBe(false);
    });
  });

  describe('reset - reiniciar juego', () => {
    it('reinicia el estado del juego', () => {
      usePuertoPalabrasStore.getState().loadWords(palabrasPrueba);
      usePuertoPalabrasStore.setState({ roundWords: palabrasPrueba });
      usePuertoPalabrasStore.getState().assignWord('gato', 'sustantivo');
      usePuertoPalabrasStore.getState().reset();

      const state = usePuertoPalabrasStore.getState();
      expect(state.xp).toBe(0);
      expect(state.repaired).toBe(0);
      expect(state.assigned).toEqual({});
      expect(state.feedback).toBeNull();
    });
  });
});
