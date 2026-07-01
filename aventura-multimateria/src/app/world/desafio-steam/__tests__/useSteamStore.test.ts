import useSteamStore from '../useSteamStore';

describe('useSteamStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSteamStore.setState({
      currentTask: 0,
      lives: 3,
      xp: 0,
      gameStatus: 'playing',
      gameCompleted: false,
      showInstructions: false,
      badge: null,
      pendingAdvance: false,
      feedback: null,
    });
  });

  it('activa gameCompleted al terminar el último nivel', () => {
    const tasks = useSteamStore.getState().tasks;
    useSteamStore.setState({ currentTask: tasks.length - 1 });
    useSteamStore.getState().nextTask();

    const state = useSteamStore.getState();
    expect(state.gameCompleted).toBe(true);
    expect(state.gameStatus).toBe('completed');
    expect(state.badge).toEqual({ name: 'Ingeniero Junior' });
  });

  it('marca failed cuando se pierden todas las vidas', () => {
    useSteamStore.setState({ lives: 1 });
    useSteamStore.getState().loseLife();

    expect(useSteamStore.getState().lives).toBe(0);
    expect(useSteamStore.getState().gameStatus).toBe('failed');
  });

  it('avanza de nivel tras hideFeedback cuando pendingAdvance es true', () => {
    useSteamStore.setState({ pendingAdvance: true, currentTask: 0 });
    useSteamStore.getState().hideFeedback();

    expect(useSteamStore.getState().currentTask).toBe(1);
    expect(useSteamStore.getState().pendingAdvance).toBe(false);
  });
});
