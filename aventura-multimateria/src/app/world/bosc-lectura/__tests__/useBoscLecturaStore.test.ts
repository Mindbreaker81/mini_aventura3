import { useBoscLecturaStore } from '../useBoscLecturaStore';
import type { BoscPassage } from '../useBoscLecturaStore';

const pasajesPrueba: BoscPassage[] = [
  {
    id: 1,
    title: 'Test 1',
    paragraph: 'Texto de prueba uno.',
    questions: [
      { q: 'P1?', type: 'single', options: ['A', 'B'], answer: 0, explanation: 'A' },
      { q: 'P2?', type: 'true_false', answer: true, explanation: 'Verdadero' },
    ],
  },
  {
    id: 2,
    title: 'Test 2',
    paragraph: 'Texto de prueba dos.',
    questions: [
      { q: 'P3?', type: 'single', options: ['X', 'Y'], answer: 1, explanation: 'Y' },
    ],
  },
];

describe('useBoscLecturaStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useBoscLecturaStore.getState().reset();
  });

  it('inicializa con pasajes aleatorios', () => {
    useBoscLecturaStore.getState().initializeGame(pasajesPrueba);
    const state = useBoscLecturaStore.getState();
    expect(state.selectedPassages.length).toBeGreaterThan(0);
    expect(state.gameStatus).toBe('playing');
    expect(state.energy).toBe(5);
  });

  it('avanza preguntas con nextQuestion', () => {
    useBoscLecturaStore.getState().initializeGame([pasajesPrueba[0]]);
    expect(useBoscLecturaStore.getState().currentQuestionIndex).toBe(0);

    useBoscLecturaStore.getState().nextQuestion();
    expect(useBoscLecturaStore.getState().currentQuestionIndex).toBe(1);
  });

  it('marca failed al perder toda la energía', () => {
    useBoscLecturaStore.getState().initializeGame(pasajesPrueba);
    for (let i = 0; i < 5; i++) {
      useBoscLecturaStore.getState().loseHeart();
    }
    expect(useBoscLecturaStore.getState().gameStatus).toBe('failed');
    expect(useBoscLecturaStore.getState().energy).toBe(0);
  });
});
