import { shuffle, selectRandom } from '../random';
import { hasActiveSession, hasActiveSessionForMode } from '../gameSession';

describe('shared/random', () => {
  it('shuffle conserva todos los elementos', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual(input.sort());
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('selectRandom limita el tamaño', () => {
    const result = selectRandom([1, 2, 3, 4, 5, 6, 7, 8], 3);
    expect(result).toHaveLength(3);
  });
});

describe('shared/gameSession', () => {
  it('detecta sesión playing', () => {
    expect(hasActiveSession({ gameStatus: 'playing' })).toBe(true);
  });

  it('detecta sesión completed', () => {
    expect(hasActiveSession({ gameStatus: 'completed' })).toBe(true);
  });

  it('detecta progreso parcial', () => {
    expect(hasActiveSession({ gameStatus: 'instructions', repaired: 2 })).toBe(true);
  });

  it('no detecta sesión en estado inicial', () => {
    expect(hasActiveSession({ gameStatus: 'instructions', showInstructions: true })).toBe(false);
  });

  it('hasActiveSessionForMode exige coincidencia de modo', () => {
    expect(
      hasActiveSessionForMode(
        { gameStatus: 'playing', mode: 'continent', completedStamps: 2 },
        'ocean'
      )
    ).toBe(false);
    expect(
      hasActiveSessionForMode(
        { gameStatus: 'playing', mode: 'continent', completedStamps: 2 },
        'continent'
      )
    ).toBe(true);
  });
});
