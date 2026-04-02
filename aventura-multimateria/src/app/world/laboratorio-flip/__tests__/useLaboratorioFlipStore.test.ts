import useLaboratorioFlipStore from '../useLaboratorioFlipStore';
import type { FlipLesson } from '../types';
import { EXPERIMENT_PIECES } from '../types';

const leccionesPrueba: FlipLesson[] = [
  {
    id: 'test-1',
    title: 'Lección de prueba 1',
    captions: '',
    thumbnail: '',
    questions: [
      { q: '¿Pregunta 1?', options: ['A', 'B', 'C'], answer: 0, explanation: 'Porque A' },
      { q: '¿Pregunta 2?', options: ['X', 'Y', 'Z'], answer: 1, explanation: 'Porque Y' },
      { q: '¿Pregunta 3?', options: ['1', '2', '3'], answer: 2, explanation: 'Porque 3' },
    ],
  },
  {
    id: 'test-2',
    title: 'Lección de prueba 2',
    captions: '',
    thumbnail: '',
    questions: [
      { q: '¿P1?', options: ['A', 'B'], answer: 0, explanation: 'A' },
      { q: '¿P2?', options: ['C', 'D'], answer: 1, explanation: 'D' },
      { q: '¿P3?', options: ['E', 'F'], answer: 0, explanation: 'E' },
    ],
  },
];

describe('useLaboratorioFlipStore', () => {
  beforeEach(() => {
    // Limpiar localStorage para evitar estado persistido entre tests
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    // Reiniciar el store a estado base
    useLaboratorioFlipStore.setState({
      currentLesson: 0,
      answers: [null, null, null],
      completedLessons: 0,
      piecesObtained: 0,
      xp: 0,
      lessons: [],
      experimentPieces: EXPERIMENT_PIECES.map(p => ({ ...p, obtained: false })),
      feedback: null,
      gameStatus: 'instructions',
      badge: false,
      showInstructions: true,
      videoWatched: false,
      quizStarted: false,
    });
  });

  describe('estado inicial', () => {
    it('tiene el estado inicial correcto', () => {
      const state = useLaboratorioFlipStore.getState();

      expect(state.currentLesson).toBe(0);
      expect(state.answers).toEqual([null, null, null]);
      expect(state.completedLessons).toBe(0);
      expect(state.piecesObtained).toBe(0);
      expect(state.xp).toBe(0);
      expect(state.gameStatus).toBe('instructions');
      expect(state.badge).toBe(false);
      expect(state.showInstructions).toBe(true);
      expect(state.videoWatched).toBe(false);
      expect(state.quizStarted).toBe(false);
      expect(state.feedback).toBeNull();
    });
  });

  describe('initializeGame - inicializar juego', () => {
    it('configura el juego con lecciones aleatorias', () => {
      useLaboratorioFlipStore.getState().initializeGame();
      const state = useLaboratorioFlipStore.getState();

      expect(state.gameStatus).toBe('playing');
      expect(state.lessons.length).toBeGreaterThan(0);
      expect(state.lessons.length).toBeLessThanOrEqual(4);
      expect(state.currentLesson).toBe(0);
      expect(state.badge).toBe(false);
    });
  });

  describe('getCorrectAnswersCount - contar respuestas correctas', () => {
    it('retorna un número (no null ni undefined)', () => {
      useLaboratorioFlipStore.setState({ lessons: leccionesPrueba });
      const count = useLaboratorioFlipStore.getState().getCorrectAnswersCount();

      expect(typeof count).toBe('number');
      expect(count).not.toBeNull();
      expect(count).not.toBeNaN();
    });

    it('retorna 0 cuando no hay respuestas seleccionadas', () => {
      useLaboratorioFlipStore.setState({
        lessons: leccionesPrueba,
        currentLesson: 0,
        answers: [null, null, null],
      });
      const count = useLaboratorioFlipStore.getState().getCorrectAnswersCount();
      expect(count).toBe(0);
    });

    it('cuenta correctamente las respuestas acertadas', () => {
      useLaboratorioFlipStore.setState({
        lessons: leccionesPrueba,
        currentLesson: 0,
        answers: [0, 1, 2], // todas correctas para lección test-1
      });
      const count = useLaboratorioFlipStore.getState().getCorrectAnswersCount();
      expect(count).toBe(3);
    });

    it('cuenta solo las respuestas correctas, no las incorrectas', () => {
      useLaboratorioFlipStore.setState({
        lessons: leccionesPrueba,
        currentLesson: 0,
        answers: [0, 0, 0], // solo la primera es correcta
      });
      const count = useLaboratorioFlipStore.getState().getCorrectAnswersCount();
      expect(count).toBe(1);
    });

    it('retorna 0 cuando no hay lección actual disponible', () => {
      useLaboratorioFlipStore.setState({
        lessons: [],
        currentLesson: 0,
        answers: [0, 1, 2],
      });
      const count = useLaboratorioFlipStore.getState().getCorrectAnswersCount();
      expect(count).toBe(0);
    });
  });

  describe('selectAnswer - seleccionar respuesta', () => {
    it('actualiza la respuesta en el índice correcto', () => {
      useLaboratorioFlipStore.getState().selectAnswer(0, 2);
      expect(useLaboratorioFlipStore.getState().answers[0]).toBe(2);

      useLaboratorioFlipStore.getState().selectAnswer(1, 0);
      expect(useLaboratorioFlipStore.getState().answers[1]).toBe(0);
    });
  });

  describe('awardXP - otorgar experiencia', () => {
    it('acumula XP correctamente', () => {
      useLaboratorioFlipStore.getState().awardXP(10);
      useLaboratorioFlipStore.getState().awardXP(8);
      expect(useLaboratorioFlipStore.getState().xp).toBe(18);
    });
  });

  describe('flujo de video y quiz', () => {
    it('no permite iniciar quiz sin haber visto el video', () => {
      useLaboratorioFlipStore.setState({ videoWatched: false });
      useLaboratorioFlipStore.getState().startQuiz();
      expect(useLaboratorioFlipStore.getState().gameStatus).not.toBe('quiz');
    });

    it('permite iniciar quiz después de ver el video', () => {
      useLaboratorioFlipStore.setState({ videoWatched: true, gameStatus: 'video' });
      useLaboratorioFlipStore.getState().startQuiz();
      const state = useLaboratorioFlipStore.getState();

      expect(state.gameStatus).toBe('quiz');
      expect(state.quizStarted).toBe(true);
      expect(state.answers).toEqual([null, null, null]);
    });
  });

  describe('showFeedback / hideFeedback', () => {
    it('muestra y oculta el feedback', () => {
      useLaboratorioFlipStore.getState().showFeedback(true, '¡Correcto!', 'Bien hecho');
      expect(useLaboratorioFlipStore.getState().feedback).toEqual({
        show: true,
        success: true,
        message: '¡Correcto!',
        explanation: 'Bien hecho',
      });

      useLaboratorioFlipStore.getState().hideFeedback();
      expect(useLaboratorioFlipStore.getState().feedback).toBeNull();
    });
  });
});
