import { useMapamundiV2Store } from '../useMapamundiV2Store';

describe('useMapamundiV2Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useMapamundiV2Store.getState().initializeGame('continent');
  });

  it('inicializa tareas para el modo continente', () => {
    const state = useMapamundiV2Store.getState();
    expect(state.tasks.length).toBe(7);
    expect(state.mode).toBe('continent');
    expect(state.lives).toBe(5);
  });

  it('gana XP y sellos al acertar', () => {
    const task = useMapamundiV2Store.getState().tasks[0];
    useMapamundiV2Store.getState().selectRegion(task.targetId);
    useMapamundiV2Store.getState().submitAnswer();

    const state = useMapamundiV2Store.getState();
    expect(state.completedStamps).toBe(1);
    expect(state.xp).toBeGreaterThan(0);
  });

  it('pierde vidas al fallar', () => {
    useMapamundiV2Store.getState().selectRegion('INVALID');
    useMapamundiV2Store.getState().submitAnswer();
    expect(useMapamundiV2Store.getState().lives).toBe(4);
  });
});
