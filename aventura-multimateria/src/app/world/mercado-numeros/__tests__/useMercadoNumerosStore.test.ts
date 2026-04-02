import { useMercadoNumerosStore } from '../useMercadoNumerosStore';
import type { PaymentTask, TimeTask, FractionTask, MercadoTask } from '../types';

const tareasPrueba: MercadoTask[] = [
  {
    id: 1,
    type: 'PAGO',
    statement: 'Paga exactamente 2.50€',
    explanation: 'Necesitas 2€ + 50c',
    amount: 2.5,
  } as PaymentTask,
  {
    id: 2,
    type: 'HORA',
    statement: '¿Cuántos minutos quedan?',
    explanation: 'Son 30 minutos',
    options: ['15 min', '30 min', '45 min'],
    answer: 1,
  } as TimeTask,
  {
    id: 3,
    type: 'FRACCION',
    statement: '¿Cuánto es 1/2 de 10?',
    explanation: 'La mitad de 10 es 5',
    answer: 5,
    options: ['3', '5', '7'],
  } as FractionTask,
];

describe('useMercadoNumerosStore', () => {
  beforeEach(() => {
    // Resetear el store a su estado inicial
    useMercadoNumerosStore.setState({
      currentTask: 0,
      completedBaskets: 0,
      hearts: 3,
      xp: 0,
      tasks: [],
      selectedCoins: [],
      currentAnswer: null,
      feedback: null,
      gameStatus: 'instructions',
      badge: false,
    });
  });

  describe('loadTasks - carga de tareas', () => {
    it('establece el estado inicial correctamente', () => {
      useMercadoNumerosStore.getState().loadTasks(tareasPrueba);
      const state = useMercadoNumerosStore.getState();

      expect(state.tasks.length).toBeGreaterThan(0);
      expect(state.tasks.length).toBeLessThanOrEqual(8);
      expect(state.currentTask).toBe(0);
      expect(state.hearts).toBe(3);
      expect(state.xp).toBe(0);
      expect(state.completedBaskets).toBe(0);
      expect(state.gameStatus).toBe('instructions');
      expect(state.selectedCoins).toEqual([]);
      expect(state.feedback).toBeNull();
      expect(state.badge).toBe(false);
    });
  });

  describe('startGame - inicio del juego', () => {
    it('cambia el estado a playing', () => {
      useMercadoNumerosStore.getState().loadTasks(tareasPrueba);
      useMercadoNumerosStore.getState().startGame();

      expect(useMercadoNumerosStore.getState().gameStatus).toBe('playing');
    });
  });

  describe('selectCoin - seleccionar moneda', () => {
    it('añade una moneda a la selección', () => {
      useMercadoNumerosStore.getState().selectCoin(2);
      expect(useMercadoNumerosStore.getState().selectedCoins).toEqual([2]);
    });

    it('añade múltiples monedas', () => {
      useMercadoNumerosStore.getState().selectCoin(2);
      useMercadoNumerosStore.getState().selectCoin(0.5);
      expect(useMercadoNumerosStore.getState().selectedCoins).toEqual([2, 0.5]);
    });

    it('no permite exceder 10€', () => {
      useMercadoNumerosStore.getState().selectCoin(5);
      useMercadoNumerosStore.getState().selectCoin(5);
      useMercadoNumerosStore.getState().selectCoin(1); // Total sería 11€
      expect(useMercadoNumerosStore.getState().selectedCoins).toEqual([5, 5]);
    });
  });

  describe('removeCoin - quitar moneda', () => {
    it('elimina una moneda por índice', () => {
      useMercadoNumerosStore.getState().selectCoin(2);
      useMercadoNumerosStore.getState().selectCoin(1);
      useMercadoNumerosStore.getState().removeCoin(0);
      expect(useMercadoNumerosStore.getState().selectedCoins).toEqual([1]);
    });
  });

  describe('loseHeart - perder vida', () => {
    it('reduce el número de vidas', () => {
      useMercadoNumerosStore.getState().loseHeart();
      expect(useMercadoNumerosStore.getState().hearts).toBe(2);
    });

    it('marca game over al perder todas las vidas', () => {
      useMercadoNumerosStore.getState().loseHeart();
      useMercadoNumerosStore.getState().loseHeart();
      useMercadoNumerosStore.getState().loseHeart();
      const state = useMercadoNumerosStore.getState();

      expect(state.hearts).toBe(0);
      expect(state.gameStatus).toBe('failed');
    });
  });

  describe('gainXP - ganar experiencia', () => {
    it('acumula XP correctamente', () => {
      useMercadoNumerosStore.getState().gainXP(15);
      useMercadoNumerosStore.getState().gainXP(15);
      expect(useMercadoNumerosStore.getState().xp).toBe(30);
    });
  });

  describe('showFeedback / hideFeedback - feedback al usuario', () => {
    it('muestra feedback correcto', () => {
      useMercadoNumerosStore.getState().showFeedback(true, '¡Bien hecho!');
      const feedback = useMercadoNumerosStore.getState().feedback;
      expect(feedback).toEqual({ show: true, correct: true, message: '¡Bien hecho!' });
    });

    it('oculta el feedback', () => {
      useMercadoNumerosStore.getState().showFeedback(true, '¡Bien!');
      useMercadoNumerosStore.getState().hideFeedback();
      expect(useMercadoNumerosStore.getState().feedback).toBeNull();
    });
  });

  describe('completeGame - completar juego', () => {
    it('otorga bonus y badge si quedan vidas', () => {
      useMercadoNumerosStore.getState().loadTasks(tareasPrueba);
      useMercadoNumerosStore.getState().completeGame();
      const state = useMercadoNumerosStore.getState();

      expect(state.gameStatus).toBe('completed');
      expect(state.xp).toBe(80); // bonus XP
      expect(state.badge).toBe(true);
    });

    it('no otorga bonus ni badge si no quedan vidas', () => {
      useMercadoNumerosStore.getState().loadTasks(tareasPrueba);
      useMercadoNumerosStore.setState({ hearts: 0 });
      useMercadoNumerosStore.getState().completeGame();
      const state = useMercadoNumerosStore.getState();

      expect(state.gameStatus).toBe('completed');
      expect(state.xp).toBe(0);
      expect(state.badge).toBe(false);
    });
  });
});
