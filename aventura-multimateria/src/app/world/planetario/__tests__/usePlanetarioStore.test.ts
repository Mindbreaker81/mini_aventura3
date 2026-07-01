import { usePlanetarioStore, getPoolBodyIds, formatOrder } from '../usePlanetarioStore';
import type { CelestialBody } from '../types';
import { MODE_CONFIG } from '../types';

const cuerposPrueba: CelestialBody[] = [
  { id: 'a', name: 'Mercurio', order: 1, fact: 'Primero', emoji: '☿️', type: 'planet' },
  { id: 'b', name: 'Venus', order: 2, fact: 'Segundo', emoji: '♀️', type: 'planet' },
  { id: 'c', name: 'Tierra', order: 3, fact: 'Tercero', emoji: '🌍', type: 'planet' },
  { id: 'd', name: 'Marte', order: 4, fact: 'Cuarto', emoji: '♂️', type: 'planet' },
  { id: 'e', name: 'Júpiter', order: 5, fact: 'Quinto', emoji: '♃', type: 'planet' },
  { id: 'f', name: 'Saturno', order: 6, fact: 'Sexto', emoji: '♄', type: 'planet' },
  { id: 'g', name: 'Urano', order: 7, fact: 'Séptimo', emoji: '♅', type: 'planet' },
  { id: 'h', name: 'Neptuno', order: 8, fact: 'Octavo', emoji: '♆', type: 'planet' },
  { id: 'i', name: 'Sputnik', order: 9, fact: 'Hito', type: 'milestone' },
  { id: 'j', name: 'Gagarin', order: 10, fact: 'Hito 2', type: 'milestone' },
  { id: 'k', name: 'Apolo 11', order: 11, fact: 'Hito 3', type: 'milestone' },
  { id: 'l', name: 'Voyager', order: 12, fact: 'Hito 4', type: 'milestone' },
];

describe('usePlanetarioStore', () => {
  beforeEach(() => {
    localStorage.clear();
    usePlanetarioStore.getState().loadBodies('planetas', cuerposPrueba);
    usePlanetarioStore.setState({ showInstructions: false, gameStatus: 'playing' });
  });

  it('ordena correctamente los cuerpos de la ronda en modo planetas', () => {
    const { correctOrder, roundBodies, mode } = usePlanetarioStore.getState();
    expect(mode).toBe('planetas');
    expect(roundBodies).toHaveLength(MODE_CONFIG.planetas.roundSize);
    expect(correctOrder).toHaveLength(MODE_CONFIG.planetas.roundSize);
    const orders = roundBodies.map((b) => b.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(roundBodies.every((b) => b.type === 'planet')).toBe(true);
  });

  it('inicializa modo exploracion solo con hitos', () => {
    usePlanetarioStore.getState().loadBodies('exploracion', cuerposPrueba);
    const { roundBodies, mode } = usePlanetarioStore.getState();
    expect(mode).toBe('exploracion');
    expect(roundBodies.every((b) => b.type === 'milestone')).toBe(true);
  });

  it('completa el juego con orden correcto', () => {
    const { correctOrder } = usePlanetarioStore.getState();
    usePlanetarioStore.setState({ timeline: [...correctOrder] });
    usePlanetarioStore.getState().submitTimeline();

    const state = usePlanetarioStore.getState();
    expect(state.gameStatus).toBe('completed');
    expect(state.badge).toBe(true);
    expect(state.xp).toBeGreaterThan(0);
  });

  it('pierde vida con orden incorrecto', () => {
    const { correctOrder } = usePlanetarioStore.getState();
    usePlanetarioStore.setState({ timeline: [...correctOrder].reverse(), lives: 3 });
    usePlanetarioStore.getState().submitTimeline();
    expect(usePlanetarioStore.getState().lives).toBe(2);
  });

  it('marca failed sin vidas', () => {
    const { correctOrder } = usePlanetarioStore.getState();
    usePlanetarioStore.setState({ timeline: [...correctOrder].reverse(), lives: 1 });
    usePlanetarioStore.getState().submitTimeline();
    expect(usePlanetarioStore.getState().gameStatus).toBe('failed');
  });

  it('avisa si la órbita está incompleta', () => {
    usePlanetarioStore.getState().submitTimeline();
    expect(usePlanetarioStore.getState().feedback?.message).toBe('planetario.feedback.incomplete');
  });

  it('mueve cuerpos entre pool y slot', () => {
    const bodyId = usePlanetarioStore.getState().roundBodies[0].id;
    usePlanetarioStore.getState().moveToSlot(bodyId, 0);
    expect(usePlanetarioStore.getState().timeline[0]).toBe(bodyId);
    usePlanetarioStore.getState().moveToPool(bodyId);
    expect(usePlanetarioStore.getState().timeline[0]).toBeNull();
  });

  it('resetGame reinicia la partida', () => {
    usePlanetarioStore.getState().resetGame();
    expect(usePlanetarioStore.getState().showInstructions).toBe(true);
    expect(usePlanetarioStore.getState().gameStatus).toBe('instructions');
  });
});

describe('planetario helpers', () => {
  it('getPoolBodyIds excluye cuerpos colocados', () => {
    const timeline: (string | null)[] = ['a', 'b', null, null, null, null, null, null];
    const pool = getPoolBodyIds(cuerposPrueba.slice(0, 8), timeline);
    expect(pool).not.toContain('a');
    expect(pool).not.toContain('b');
  });

  it('formatOrder muestra posición', () => {
    expect(formatOrder(3)).toBe('#3');
  });
});
