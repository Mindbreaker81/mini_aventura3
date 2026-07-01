import type { KeyboardEvent } from 'react';
import { chainKeyboardHandler, handleActivationKeys } from '../keyboard';

describe('keyboard helpers', () => {
  it('chainKeyboardHandler delega al handler original', () => {
    const inner = jest.fn();
    const chained = chainKeyboardHandler(inner);
    const event = {
      key: 'Enter',
      preventDefault: jest.fn(),
      defaultPrevented: false,
    } as unknown as KeyboardEvent;

    chained(event);
    expect(inner).toHaveBeenCalledWith(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('handleActivationKeys ejecuta la acción con Enter', () => {
    const action = jest.fn();
    const event = {
      key: 'Enter',
      preventDefault: jest.fn(),
    } as unknown as KeyboardEvent;

    handleActivationKeys(event, action);
    expect(action).toHaveBeenCalled();
  });
});
