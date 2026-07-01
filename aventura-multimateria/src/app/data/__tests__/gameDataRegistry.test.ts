import { getGameData, GAME_DATA_KEYS } from '../gameDataRegistry';

describe('gameDataRegistry Fase 7', () => {
  it('incluye las claves de los tres juegos nuevos', () => {
    expect(GAME_DATA_KEYS).toContain('fabrica-reciclaje-items');
    expect(GAME_DATA_KEYS).toContain('taller-ortografia-items');
    expect(GAME_DATA_KEYS).toContain('planetario-bodies');
  });

  it('carga datos pedagógicos en los tres locales', () => {
    for (const locale of ['es', 'ca', 'en'] as const) {
      const reciclaje = getGameData(locale, 'fabrica-reciclaje-items');
      const ortografia = getGameData(locale, 'taller-ortografia-items');
      const planetario = getGameData(locale, 'planetario-bodies');
      expect(Array.isArray(reciclaje)).toBe(true);
      expect(reciclaje.length).toBeGreaterThanOrEqual(40);
      expect(Array.isArray(ortografia)).toBe(true);
      expect(ortografia.length).toBeGreaterThanOrEqual(70);
      expect(Array.isArray(planetario)).toBe(true);
      expect(planetario.length).toBeGreaterThanOrEqual(20);
    }
  });
});
