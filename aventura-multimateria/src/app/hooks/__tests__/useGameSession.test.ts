import { renderHook } from '@testing-library/react';
import { useGameSession, useGameSessionWhen } from '../useGameSession';

describe('useGameSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicializa cuando no hay sesión activa', () => {
    const initialize = jest.fn();
    renderHook(() =>
      useGameSession(
        () => ({ gameStatus: 'instructions' as const, showInstructions: true }),
        initialize
      )
    );
    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it('no inicializa con sesión activa', () => {
    const initialize = jest.fn();
    renderHook(() =>
      useGameSession(
        () => ({ gameStatus: 'playing' as const }),
        initialize
      )
    );
    expect(initialize).not.toHaveBeenCalled();
  });

  it('useGameSessionWhen respeta condición', () => {
    const initialize = jest.fn();
    renderHook(() => useGameSessionWhen(() => false, initialize));
    expect(initialize).not.toHaveBeenCalled();
  });
});
