import { useMuseoTiempoStore, getPoolEventIds, formatYear } from '../useMuseoTiempoStore';
import type { HistoricalEvent } from '../types';
import { ROUND_SIZE } from '../types';

const eventosPrueba: HistoricalEvent[] = [
  { id: 'a', title: 'Evento A', year: 100, description: 'Primero' },
  { id: 'b', title: 'Evento B', year: 200, description: 'Segundo' },
  { id: 'c', title: 'Evento C', year: 300, description: 'Tercero' },
  { id: 'd', title: 'Evento D', year: 400, description: 'Cuarto' },
  { id: 'e', title: 'Evento E', year: 500, description: 'Quinto' },
  { id: 'f', title: 'Evento F', year: 600, description: 'Sexto' },
  { id: 'g', title: 'Evento G', year: 700, description: 'Séptimo' },
  { id: 'h', title: 'Evento H', year: 800, description: 'Octavo' },
  { id: 'i', title: 'Evento I', year: 900, description: 'Noveno' },
];

describe('useMuseoTiempoStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useMuseoTiempoStore.getState().loadEvents(eventosPrueba);
    useMuseoTiempoStore.setState({ showInstructions: false, gameStatus: 'playing' });
  });

  it('ordena correctamente los eventos de la ronda', () => {
    const { correctOrder, roundEvents } = useMuseoTiempoStore.getState();
    expect(roundEvents).toHaveLength(ROUND_SIZE);
    expect(correctOrder).toHaveLength(ROUND_SIZE);
    const years = roundEvents.map((e) => e.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it('completa el juego con orden correcto', () => {
    const { correctOrder } = useMuseoTiempoStore.getState();
    useMuseoTiempoStore.setState({ timeline: [...correctOrder] });
    useMuseoTiempoStore.getState().submitTimeline();

    const state = useMuseoTiempoStore.getState();
    expect(state.gameStatus).toBe('completed');
    expect(state.badge).toBe(true);
    expect(state.xp).toBeGreaterThan(0);
  });

  it('pierde vida con orden incorrecto', () => {
    const { correctOrder } = useMuseoTiempoStore.getState();
    useMuseoTiempoStore.setState({ timeline: [...correctOrder].reverse(), lives: 3 });
    useMuseoTiempoStore.getState().submitTimeline();
    expect(useMuseoTiempoStore.getState().lives).toBe(2);
  });

  it('marca failed sin vidas', () => {
    const { correctOrder } = useMuseoTiempoStore.getState();
    useMuseoTiempoStore.setState({ timeline: [...correctOrder].reverse(), lives: 1 });
    useMuseoTiempoStore.getState().submitTimeline();
    expect(useMuseoTiempoStore.getState().gameStatus).toBe('failed');
  });

  it('avisa si la línea temporal está incompleta', () => {
    useMuseoTiempoStore.getState().submitTimeline();
    expect(useMuseoTiempoStore.getState().feedback?.message).toBe('museo.feedback.incomplete');
  });

  it('mueve eventos entre pool y slot', () => {
    const eventId = useMuseoTiempoStore.getState().roundEvents[0].id;
    useMuseoTiempoStore.getState().moveToSlot(eventId, 0);
    expect(useMuseoTiempoStore.getState().timeline[0]).toBe(eventId);
    useMuseoTiempoStore.getState().moveToPool(eventId);
    expect(useMuseoTiempoStore.getState().timeline[0]).toBeNull();
  });

  it('resetGame reinicia la partida', () => {
    useMuseoTiempoStore.getState().resetGame();
    expect(useMuseoTiempoStore.getState().showInstructions).toBe(true);
    expect(useMuseoTiempoStore.getState().gameStatus).toBe('instructions');
  });
});

describe('museo helpers', () => {
  it('getPoolEventIds excluye eventos colocados', () => {
    const timeline: (string | null)[] = ['a', 'b', null, null, null, null, null, null];
    const pool = getPoolEventIds(eventosPrueba.slice(0, 8), timeline);
    expect(pool).not.toContain('a');
    expect(pool).not.toContain('b');
  });

  it('formatYear muestra a.C. para años negativos', () => {
    expect(formatYear(-100)).toBe('100 a.C.');
    expect(formatYear(1969)).toBe('1969');
  });
});
