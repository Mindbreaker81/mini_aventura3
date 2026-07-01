import { useTallerOrtografiaStore } from '../useTallerOrtografiaStore';
import type { OrtografiaItem } from '../types';
import { ORTOGRAFIA_ROUND_SIZE } from '../types';

const itemsPrueba: OrtografiaItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  sentence: `Frase ___ ${i + 1}`,
  options: ['correcta', 'incorrecta', 'otra'],
  answer: 0,
  rule: `Regla ${i + 1}`,
  topic: 'bv',
}));

describe('useTallerOrtografiaStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useTallerOrtografiaStore.getState().loadItems(itemsPrueba);
    useTallerOrtografiaStore.setState({ showInstructions: false, gameStatus: 'playing' });
  });

  it('carga una ronda de preguntas', () => {
    expect(useTallerOrtografiaStore.getState().roundItems).toHaveLength(ORTOGRAFIA_ROUND_SIZE);
  });

  it('otorga XP al acertar', () => {
    useTallerOrtografiaStore.getState().answerQuestion(0);
    expect(useTallerOrtografiaStore.getState().xp).toBe(10);
  });

  it('pierde corazón al fallar', () => {
    useTallerOrtografiaStore.getState().answerQuestion(1);
    expect(useTallerOrtografiaStore.getState().hearts).toBe(4);
  });

  it('completa la partida tras la última pregunta', () => {
    const { roundItems } = useTallerOrtografiaStore.getState();
    roundItems.forEach((_, index) => {
      useTallerOrtografiaStore.setState({ currentIndex: index });
      useTallerOrtografiaStore.getState().answerQuestion(0);
      useTallerOrtografiaStore.getState().nextQuestion();
    });
    const state = useTallerOrtografiaStore.getState();
    expect(state.gameStatus).toBe('completed');
    expect(state.badge).toBe(true);
  });

  it('marca failed sin corazones', () => {
    useTallerOrtografiaStore.setState({ hearts: 1 });
    useTallerOrtografiaStore.getState().answerQuestion(1);
    expect(useTallerOrtografiaStore.getState().gameStatus).toBe('failed');
  });
});
