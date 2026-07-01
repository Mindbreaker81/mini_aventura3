import type { KeyboardEvent, KeyboardEventHandler } from 'react';

/**
 * Encadena un manejador existente (p. ej. @hello-pangea/dnd) con soporte
 * explícito para Enter/Espacio en elementos focusables.
 */
export function chainKeyboardHandler(
  handler?: KeyboardEventHandler
): KeyboardEventHandler {
  return (event: KeyboardEvent) => {
    handler?.(event);
    if (
      !event.defaultPrevented &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
    }
  };
}

/**
 * Activa una acción al pulsar Enter o Espacio (patrón botón).
 */
export function handleActivationKeys(
  event: KeyboardEvent,
  action: () => void
): void {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  action();
}
