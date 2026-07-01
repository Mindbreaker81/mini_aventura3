import { useFabricaReciclajeStore } from '../useFabricaReciclajeStore';
import type { ReciclajeItem } from '../types';
import { RECICLAJE_WIN_TARGET } from '../types';

const itemsPrueba: ReciclajeItem[] = [
  { id: 't1', item: 'Botella', emoji: '🥤', bin: 'amarillo', rule: 'Plástico al amarillo' },
  { id: 't2', item: 'Periódico', emoji: '📰', bin: 'azul', rule: 'Papel al azul' },
  { id: 't3', item: 'Botella vidrio', emoji: '🍾', bin: 'verde', rule: 'Vidrio al verde' },
  { id: 't4', item: 'Cáscara plátano', emoji: '🍌', bin: 'marron', rule: 'Orgánico al marrón' },
  { id: 't5', item: 'Hojas', emoji: '🍃', bin: 'organico', rule: 'Jardín al orgánico' },
  { id: 't6', item: 'Lata', emoji: '🥫', bin: 'amarillo', rule: 'Metal al amarillo' },
  { id: 't7', item: 'Caja', emoji: '📦', bin: 'azul', rule: 'Cartón al azul' },
  { id: 't8', item: 'Tarro', emoji: '🫙', bin: 'verde', rule: 'Vidrio al verde' },
];

describe('useFabricaReciclajeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFabricaReciclajeStore.getState().loadItems(itemsPrueba);
    useFabricaReciclajeStore.setState({
      roundItems: itemsPrueba,
      showInstructions: false,
      gameStatus: 'playing',
    });
  });

  it('otorga XP al clasificar correctamente', () => {
    useFabricaReciclajeStore.getState().assignItem('t1', 'amarillo');
    const state = useFabricaReciclajeStore.getState();
    expect(state.xp).toBe(10);
    expect(state.sorted).toBe(1);
    expect(state.correctIds).toContain('t1');
  });

  it('no otorga XP en error', () => {
    useFabricaReciclajeStore.getState().assignItem('t1', 'azul');
    expect(useFabricaReciclajeStore.getState().xp).toBe(0);
    expect(useFabricaReciclajeStore.getState().sorted).toBe(0);
  });

  it('completa al alcanzar el objetivo', () => {
    const pairs: [string, ReciclajeItem['bin']][] = [
      ['t1', 'amarillo'],
      ['t2', 'azul'],
      ['t3', 'verde'],
      ['t4', 'marron'],
      ['t5', 'organico'],
      ['t6', 'amarillo'],
      ['t7', 'azul'],
      ['t8', 'verde'],
    ];
    pairs.forEach(([id, bin]) => useFabricaReciclajeStore.getState().assignItem(id, bin));
    const state = useFabricaReciclajeStore.getState();
    expect(state.gameStatus).toBe('completed');
    expect(state.badge).toBe(true);
    expect(state.sorted).toBe(RECICLAJE_WIN_TARGET);
  });

  it('startGame oculta instrucciones', () => {
    useFabricaReciclajeStore.setState({ showInstructions: true, gameStatus: 'instructions' });
    useFabricaReciclajeStore.getState().startGame();
    expect(useFabricaReciclajeStore.getState().showInstructions).toBe(false);
    expect(useFabricaReciclajeStore.getState().gameStatus).toBe('playing');
  });
});
