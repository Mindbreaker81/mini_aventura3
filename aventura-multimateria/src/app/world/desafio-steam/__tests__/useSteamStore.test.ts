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

  it('resetAdventure reinicia progreso', () => {
    useSteamStore.setState({ currentTask: 2, lives: 1, xp: 50, gameStatus: 'failed' });
    useSteamStore.getState().resetAdventure();
    const state = useSteamStore.getState();
    expect(state.currentTask).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.gameStatus).toBe('playing');
  });
});
