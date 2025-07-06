# Aventura Multimateria

Aplicación web de minijuegos educativos desarrollada con Next.js, React 18, TypeScript y react-leaflet para mapas interactivos.

## Minijuegos principales

- **Puerto Palabras**: Arrastra palabras a su categoría y practica ortografía.
- **Bosc de Lectura**: Comprensión lectora.
- **Misión Mapamundi**: Mapa interactivo centrado en Barcelona usando react-leaflet.

## Tecnologías
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- react-leaflet

## Instalación

1. `npm install`
2. `npm run dev`

## Notas
- El minijuego de mapa ahora usa react-leaflet, eliminando dependencias vulnerables.

# ExplorAventura 3: Minijuegos Educativos

## 🎮 Descripción del Proyecto

ExplorAventura 3 es una plataforma educativa interactiva que presenta 6 minijuegos diseñados para estudiantes de primaria. Cada juego aborda una materia específica utilizando mecánicas divertidas y educativas, con un sistema de progreso, XP y badges para motivar el aprendizaje.

### ✨ Características Principales
- **6 Minijuegos Educativos**: Gramática, lectura, matemáticas, geografía, programación y ciencias
- **Sistema de Progreso**: XP, badges y seguimiento de avance
- **Multilingüe**: Soporte para español, catalán e inglés
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Persistencia**: Estado guardado automáticamente en localStorage
- **Navegación Intuitiva**: Dashboard centralizado con acceso fácil a todos los juegos

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
```
Frontend Framework: Next.js 15.3.4 (App Router)
Runtime: React 19.0.0
Language: TypeScript 5.8.3
Styling: Tailwind CSS 4
State Management: Zustand 5.0.6
Database: Supabase (configurada)
Internationalization: next-i18next 15.4.2
Icons: lucide-react 0.525.0
```

### Dependencias Especializadas
```
Mapas Interactivos: react-simple-maps 3.0.0 + topojson-client 3.1.0
Programación Visual: blockly 12.1.0
Reproducción de Video: react-player 3.1.0
```

### 📁 Estructura del Proyecto
```
aventura-multimateria/
├── src/
│   ├── app/
│   │   ├── data/                     # 📊 Datos de los juegos (JSON)
│   │   │   ├── puerto-words.json     # Palabras categorizadas
│   │   │   ├── bosc-passages.json    # Textos y preguntas de lectura
│   │   │   ├── mercado-tasks.json    # Problemas matemáticos
│   │   │   ├── geography-tasks.json  # Ubicaciones geográficas
│   │   │   ├── steam-tasks.json      # Desafíos de programación
│   │   │   └── flip-lessons.json     # Lecciones científicas
│   │   ├── hooks/
│   │   │   └── useNavigation.ts      # 🧭 Hook de navegación centralizado
│   │   ├── world/                    # 🌍 Directorio de minijuegos
│   │   │   ├── puerto-palabras/      # Gramática (drag & drop)
│   │   │   ├── bosc-lectura/         # Comprensión lectora
│   │   │   ├── mercado-numeros/      # Matemáticas aplicadas
│   │   │   ├── mision-mapamundi/     # Geografía interactiva
│   │   │   ├── desafio-steam/        # Programación con bloques
│   │   │   └── laboratorio-flip/     # Ciencias con videos
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # 🏠 Dashboard principal
│   └── public/
│       └── locales/                  # 🌐 Archivos de traducción
│           ├── ca/common.json        # Catalán
│           ├── en/common.json        # Inglés
│           └── es/common.json        # Español
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── CLAUDE.md                         # 🤖 Documentación para Claude
└── README.md                         # 📖 Este archivo
```

## 🎯 Descripción Detallada de Minijuegos

### 1. 🚢 Puerto de las Palabras
**Materia**: Gramática y categorización
**Ruta**: `/world/puerto-palabras`
**Mecánica**: Drag & drop de palabras en categorías gramaticales

#### Archivos Clave:
- `usePuertoPalabrasStore.ts` - Store con lógica del juego
- `page.tsx` - Interfaz principal con drag & drop
- `dragdrop-utils.ts` - Utilidades para drag & drop
- `puerto-words.json` - 50+ palabras categorizadas

#### Flujo del Juego:
1. Se presentan 12 palabras aleatorias
2. El jugador arrastra cada palabra a su categoría (sustantivo, verbo, adjetivo)
3. Feedback inmediato por cada palabra
4. XP otorgado: 5 puntos por acierto
5. Badge al completar 10 rondas correctas

#### Componentes Técnicos:
```typescript
interface WordItem {
  id: number;
  word: string;
  category: 'sustantivo' | 'verbo' | 'adjetivo';
  placed?: boolean;
}

const usePuertoPalabrasStore = create<PuertoPalabrasStore>()(
  persist(
    (set, get) => ({
      // Estado del juego
      currentWords: [],
      score: 0,
      xp: 0,
      // Funciones principales
      selectRandomWords: () => {...},
      dropWord: (wordId, category) => {...},
      checkAnswer: (wordId, category) => {...}
    }),
    { name: 'puerto-palabras-storage' }
  )
);
```

### 2. 🌳 Bosc de Lectura
**Materia**: Comprensión lectora
**Ruta**: `/world/bosc-lectura`
**Mecánica**: Leer textos y responder preguntas múltiple opción

#### Archivos Clave:
- `useBoscLecturaStore.ts` - Gestión de textos y respuestas
- `ReadingGame.tsx` - Componente principal de lectura
- `bosc-passages.json` - 15+ textos con preguntas

#### Flujo del Juego:
1. Presentación de texto para leer
2. 3-4 preguntas de comprensión
3. Retroalimentación con explicaciones
4. Sistema de "LEDs" que se iluminan por acierto
5. XP: 8 puntos por respuesta correcta

#### Estructura de Datos:
```json
{
  "id": "passage1",
  "title": "El ciclo del agua",
  "text": "El agua es esencial para la vida...",
  "questions": [
    {
      "question": "¿Cuáles son las fases del ciclo del agua?",
      "options": ["Evaporación, condensación, precipitación", "..."],
      "correct": 0,
      "explanation": "El ciclo del agua incluye..."
    }
  ]
}
```

### 3. 🛒 Mercado de Números
**Materia**: Matemáticas aplicadas
**Ruta**: `/world/mercado-numeros`
**Mecánica**: Resolver problemas de dinero, tiempo y fracciones

#### Archivos Clave:
- `useMercadoNumerosStore.ts` - Lógica matemática
- `PaymentChallenge.tsx` - Problemas de dinero
- `TimeChallenge.tsx` - Problemas de tiempo
- `FractionChallenge.tsx` - Problemas de fracciones
- `mercado-tasks.json` - 100 problemas balanceados

#### Tipos de Desafío:
1. **PAGO**: Calcular cambio, total de compra, descuentos
2. **HORA**: Duración entre horas, conversiones de tiempo
3. **FRACCION**: Comparar, sumar, simplificar fracciones

#### Estructura Técnica:
```typescript
interface MercadoTask {
  id: number;
  type: 'PAGO' | 'HORA' | 'FRACCION';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Componentes especializados por tipo
const PaymentChallenge: React.FC<{task: MercadoTask}> = ({task}) => {
  // Renderizado específico para problemas de dinero
  // Incluye iconos de monedas, calculadora visual
};
```

### 4. 🗺️ Misión Mapamundi
**Materia**: Geografía
**Ruta**: `/world/mision-mapamundi`
**Mecánica**: Localizar lugares en mapas interactivos

#### Archivos Clave:
- `useMisionMapamundiStore.ts` - Estado geográfico
- `WorldMap.tsx` - Mapa mundial con react-simple-maps
- `SpainMap.tsx` - Mapa de España con comunidades autónomas
- `geography-tasks.json` - 60+ ubicaciones

#### Características Técnicas:
```typescript
// Integración con react-simple-maps
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const WorldMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() => handleCountryClick(geo.properties.NAME)}
              style={{
                default: { fill: "#D6D6DA" },
                hover: { fill: "#F53" },
                pressed: { fill: "#E42" }
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};
```

#### Tipos de Ubicaciones:
1. **Continentes**: África, Asia, Europa, América del Norte, América del Sur, Oceanía, Antártida
2. **Océanos**: Pacífico, Atlántico, Índico, Ártico, Antártico
3. **Comunidades Autónomas**: Andalucía, Cataluña, Madrid, etc.

### 5. 🤖 Desafío STEAM
**Materia**: Programación y pensamiento computacional
**Ruta**: `/world/desafio-steam`
**Mecánica**: Programar robot con bloques visuales para navegar tablero

#### Archivos Clave:
- `useDesafioSteamStore.ts` - Lógica del robot y ejecución
- `RobotBoard.tsx` - Tablero 6x6 con visualización
- `BlocklyGame.tsx` - Editor de bloques Blockly
- `steam-tasks.json` - 6 desafíos progresivos

#### Integración Blockly:
```typescript
// Carga dinámica para evitar problemas SSR
const BlocklyGame: React.FC = () => {
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  
  useEffect(() => {
    const loadBlockly = async () => {
      if (typeof window !== 'undefined' && !window.Blockly) {
        const Blockly = await import('blockly');
        window.Blockly = Blockly;
        initializeBlockly();
        setBlocklyLoaded(true);
      }
    };
    loadBlockly();
  }, []);

  // Definición de bloques personalizados
  const initializeBlockly = () => {
    window.Blockly.Blocks['move_forward'] = {
      init: function() {
        this.appendDummyInput().appendField('avanzar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      }
    };
  };
};
```

#### Sistema de Ejecución:
1. **Compilación**: Blockly → JavaScript → Array de comandos
2. **Ejecución**: Secuencial con delays para visualización
3. **Validación**: Detección de colisiones, límites del tablero
4. **Feedback**: Animaciones del robot, mensajes de error/éxito

### 6. 🧪 Laboratorio Flip-Ciencia
**Materia**: Ciencias naturales
**Ruta**: `/world/laboratorio-flip`
**Mecánica**: Ver videos educativos y responder quiz

#### Archivos Clave:
- `useLaboratorioFlipStore.ts` - Control de videos y quiz
- `VideoCard.tsx` - Reproductor con react-player
- `Quiz.tsx` - Preguntas post-video
- `flip-lessons.json` - 16 lecciones científicas

#### Integración React-Player:
```typescript
// Importación dinámica para SSR
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const VideoCard: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  
  const handleProgress = (progress: { played: number }) => {
    // Considerar video visto al 80%
    if (progress.played >= 0.8 && !videoWatched) {
      finishVideo();
    }
  };

  return (
    <ReactPlayer
      url={lesson.videoUrl}
      playing={playing}
      onProgress={handleProgress}
      controls={true}
    />
  );
};
```

#### Mecánica de Experimento Virtual:
1. **Video**: Observar contenido científico (~90 segundos)
2. **Quiz**: 3 preguntas sobre el video
3. **Piezas**: Obtener componentes del experimento por aciertos
4. **Reacción**: Al completar 4 lecciones, "experimento reacciona"
5. **Badge**: "Científico Novato" al finalizar

## 🔧 Configuración y Desarrollo

### Instalación
```bash
# Clonar repositorio
git clone [URL_DEL_REPO]
cd aventura-multimateria

# Instalar dependencias
npm install

# Si hay conflictos (React 19 vs dependencias más antiguas)
npm install --legacy-peer-deps
```

### Comandos de Desarrollo
```bash
# Desarrollo local
npm run dev                    # http://localhost:3000

# Producción
npm run build                  # Build optimizado
npm run start                  # Servidor de producción

# Calidad de código
npm run lint                   # ESLint

# Base de datos (Supabase - opcional)
npm run supabase:start         # Instancia local
npm run supabase:stop          # Detener instancia
npm run db:reset               # Reset completo
npm run types:generate         # Generar tipos TS
```

### Variables de Entorno (Opcional)
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_project_id
```

## 🧩 Patrones de Desarrollo

### Store de Zustand (Patrón Consistente)
Todos los stores siguen esta estructura:
```typescript
interface GameStore extends BaseGameState {
  // Estado específico del juego
  currentLevel: number;
  score: number;
  xp: number;
  
  // Funciones comunes
  initializeGame: () => void;
  showInstructionsScreen: () => void;
  hideInstructionsScreen: () => void;
  awardXP: (amount: number) => void;
  showFeedback: (success: boolean, message: string) => void;
  hideFeedback: () => void;
  
  // Funciones específicas del juego
  specificGameAction: () => void;
}

const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentLevel: 0,
      score: 0,
      xp: 0,
      showInstructions: true,
      
      // Implementación de funciones
      initializeGame: () => {
        set({
          currentLevel: 0,
          score: 0,
          gameStatus: 'playing'
        });
      },
      
      awardXP: (amount: number) => {
        set(state => ({ xp: state.xp + amount }));
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        xp: state.xp,
        score: state.score,
        currentLevel: state.currentLevel
      })
    }
  )
);
```

### Componente de Página (Patrón Consistente)
```typescript
const GamePage: React.FC = () => {
  const { goToDashboard } = useNavigation();
  const {
    initializeGame,
    showInstructions,
    hideInstructionsScreen,
    // ... otros estados del store
  } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Pantalla de instrucciones
  if (showInstructions) {
    return (
      <InstructionsScreen 
        onStart={hideInstructionsScreen}
        onBack={goToDashboard}
      />
    );
  }

  // Pantalla de juego completado
  if (gameStatus === 'completed') {
    return (
      <CompletionScreen onBack={goToDashboard} />
    );
  }

  // Pantalla principal del juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Header onBack={goToDashboard} />
      <GameContent />
      <FeedbackModal />
    </div>
  );
};
```

### Sistema de Feedback
```typescript
// Feedback consistente con animaciones
const FeedbackModal: React.FC = () => {
  const { feedback, hideFeedback } = useGameStore();
  
  if (!feedback) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <div className="text-center">
          {feedback.success ? (
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          )}
          
          <h3 className={`text-xl font-bold mb-2 ${
            feedback.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {feedback.success ? '¡Excelente!' : '¡Ups!'}
          </h3>
          
          <p className="text-gray-700 mb-6">{feedback.message}</p>
          
          <button
            onClick={hideFeedback}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
              feedback.success 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 🎨 Sistema de Diseño

### Colores por Minijuego
```css
/* Puerto de las Palabras - Azul */
.puerto-theme { @apply from-blue-100 to-blue-300 text-blue-800; }

/* Bosc de Lectura - Verde */
.bosc-theme { @apply from-green-100 to-green-300 text-green-800; }

/* Mercado de Números - Naranja */
.mercado-theme { @apply from-orange-100 to-orange-300 text-orange-800; }

/* Misión Mapamundi - Índigo */
.mision-theme { @apply from-indigo-100 to-indigo-300 text-indigo-800; }

/* Desafío STEAM - Púrpura */
.steam-theme { @apply from-purple-100 to-purple-300 text-purple-800; }

/* Laboratorio Flip - Teal */
.flip-theme { @apply from-teal-100 to-teal-300 text-teal-800; }
```

### Componentes Reutilizables
```typescript
// Header consistente
const GameHeader: React.FC<{title: string, progress?: string, xp?: number}> = ({
  title, progress, xp
}) => (
  <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {progress && <span>{progress}</span>}
        {xp && <XPDisplay value={xp} />}
      </div>
    </div>
  </div>
);

// Botón de navegación estándar
const BackButton: React.FC = () => {
  const { goToDashboard } = useNavigation();
  
  return (
    <button
      onClick={goToDashboard}
      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
    >
      <ArrowLeft size={20} />
      Dashboard
    </button>
  );
};
```

## 🔄 Flujo de Datos

### Persistencia con Zustand
```typescript
// Configuración de persistencia selectiva
const persistConfig = {
  name: 'game-storage',
  partialize: (state: GameState) => ({
    // Solo persistir datos importantes
    xp: state.xp,
    score: state.score,
    completedLevels: state.completedLevels,
    badge: state.badge,
    // NO persistir estado temporal
    // showInstructions: state.showInstructions,
    // feedback: state.feedback,
  }),
};
```

### Navegación Centralizada
```typescript
// Hook reutilizable para navegación
export const useNavigation = () => {
  const router = useRouter();
  
  const goToDashboard = useCallback(() => {
    router.push('/');
  }, [router]);
  
  const goToGame = useCallback((gamePath: string) => {
    router.push(gamePath);
  }, [router]);
  
  return { goToDashboard, goToGame };
};
```

## 🚀 Consideraciones de Rendimiento

### Importaciones Dinámicas
```typescript
// Para librerías pesadas o que causan problemas SSR
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

const BlocklyEditor = dynamic(() => import('./BlocklyEditor'), {
  ssr: false
});
```

### Optimización de Re-renders
```typescript
// Uso de useCallback para funciones estables
const handleWordDrop = useCallback((wordId: number, category: string) => {
  dropWord(wordId, category);
}, [dropWord]);

// Memo para componentes que no cambian frecuentemente
const WordCard = React.memo<{word: WordItem, onDrop: Function}>(({
  word, onDrop
}) => {
  // Componente optimizado
});
```

### Lazy Loading de Datos
```typescript
// Cargar datos solo cuando se necesiten
const useGameData = (gameType: string) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      const gameData = await import(`../data/${gameType}-data.json`);
      setData(gameData.default);
    };
    
    loadData();
  }, [gameType]);
  
  return data;
};
```

## 🧪 Testing y Calidad

### Estructura de Testing (Recomendada)
```
tests/
├── __mocks__/           # Mocks para librerías externas
├── components/          # Tests de componentes
├── stores/             # Tests de stores Zustand
├── utils/              # Tests de utilidades
└── e2e/                # Tests end-to-end
```

### Ejemplo de Test para Store
```typescript
import { renderHook, act } from '@testing-library/react';
import usePuertoPalabrasStore from '../usePuertoPalabrasStore';

describe('Puerto Palabras Store', () => {
  beforeEach(() => {
    // Reset store state
    usePuertoPalabrasStore.getState().initializeGame();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => usePuertoPalabrasStore());
    
    expect(result.current.score).toBe(0);
    expect(result.current.xp).toBe(0);
    expect(result.current.currentWords).toHaveLength(12);
  });

  it('should award XP when word is correctly placed', () => {
    const { result } = renderHook(() => usePuertoPalabrasStore());
    
    act(() => {
      result.current.dropWord(1, 'sustantivo');
    });
    
    expect(result.current.xp).toBeGreaterThan(0);
  });
});
```

## 🌐 Internacionalización

### Estructura de Traducción
```json
// public/locales/es/common.json
{
  "dashboard": {
    "title": "ExplorAventura 3: Minijuegos",
    "games": {
      "puerto": "Puerto de las Palabras",
      "bosc": "Bosc de Lectura"
    }
  },
  "common": {
    "start": "Empezar",
    "back": "Volver",
    "continue": "Continuar",
    "excellent": "¡Excelente!",
    "tryAgain": "Inténtalo de nuevo"
  }
}
```

### Uso en Componentes
```typescript
import { useTranslation } from 'next-i18next';

const GameComponent: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button>{t('common.start')}</button>
    </div>
  );
};
```

## 🔧 Extensibilidad

### Crear Nuevo Minijuego
Para añadir un nuevo minijuego al proyecto:

#### 1. Estructura de Archivos
```bash
# Crear directorio del juego
mkdir src/app/world/nuevo-juego

# Archivos requeridos
touch src/app/world/nuevo-juego/types.ts
touch src/app/world/nuevo-juego/useNuevoJuegoStore.ts
touch src/app/world/nuevo-juego/page.tsx
touch src/app/data/nuevo-juego-data.json
```

#### 2. Definir Tipos
```typescript
// types.ts
export interface NuevoJuegoTask {
  id: number;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentTask: number;
  score: number;
  xp: number;
  tasks: NuevoJuegoTask[];
  gameStatus: 'instructions' | 'playing' | 'completed';
  showInstructions: boolean;
  feedback: FeedbackState | null;
}
```

#### 3. Crear Store
```typescript
// useNuevoJuegoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from './types';
import gameData from '../../data/nuevo-juego-data.json';

interface NuevoJuegoStore extends GameState {
  initializeGame: () => void;
  // ... otras funciones
}

const useNuevoJuegoStore = create<NuevoJuegoStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentTask: 0,
      score: 0,
      xp: 0,
      tasks: gameData,
      gameStatus: 'instructions',
      showInstructions: true,
      feedback: null,
      
      // Funciones
      initializeGame: () => {
        set({
          currentTask: 0,
          score: 0,
          gameStatus: 'playing'
        });
      }
    }),
    {
      name: 'nuevo-juego-storage',
      partialize: (state) => ({
        xp: state.xp,
        score: state.score
      })
    }
  )
);

export default useNuevoJuegoStore;
```

#### 4. Crear Página Principal
```typescript
// page.tsx
"use client";
import React, { useEffect } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import useNuevoJuegoStore from './useNuevoJuegoStore';

const NuevoJuego: React.FC = () => {
  const { goToDashboard } = useNavigation();
  const {
    initializeGame,
    showInstructions,
    hideInstructionsScreen,
    gameStatus
  } = useNuevoJuegoStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (showInstructions) {
    return <InstructionsScreen />;
  }

  if (gameStatus === 'completed') {
    return <CompletionScreen />;
  }

  return <GameScreen />;
};

export default NuevoJuego;
```

#### 5. Actualizar Dashboard
```typescript
// src/app/page.tsx
const minigames = [
  // ... juegos existentes
  {
    code: "nuevo-juego",
    name: "Nuevo Juego",
    description: "Descripción del nuevo juego",
    icon: <NewIcon size={32} className="text-custom-600" />,
    path: "/world/nuevo-juego",
  },
];
```

#### 6. Añadir Traducciones
```json
// public/locales/es/common.json
{
  "games": {
    "nuevoJuego": "Nuevo Juego"
  }
}
```

## 🔒 Seguridad y Buenas Prácticas

### Validación de Datos
```typescript
// Validar datos de entrada
const validateGameInput = (input: unknown): input is GameInput => {
  return (
    typeof input === 'object' &&
    input !== null &&
    'level' in input &&
    typeof input.level === 'number'
  );
};

// Sanitizar datos del usuario
const sanitizeUserInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### Prevención XSS
```typescript
// Usar dangerouslySetInnerHTML con cuidado
const SafeHTMLContent: React.FC<{content: string}> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};
```

### Control de Errores
```typescript
// Error Boundary para manejar errores de React
class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo);
    // Enviar error a servicio de logging
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 🚀 Deployment

### Build de Producción
```bash
# Optimizar para producción
npm run build

# Verificar build localmente
npm run start
```

### Variables de Entorno para Producción
```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Optimizaciones de Next.js
```typescript
// next.config.ts
const nextConfig = {
  // Optimización de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compresión
  compress: true,
  
  // PWA
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  
  // Análisis de bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error de Dependencias React 19
```bash
# Solución: Usar legacy peer deps
npm install --legacy-peer-deps
```

#### 2. Error SSR con Blockly/ReactPlayer
```typescript
// Solución: Importación dinámica
const BlocklyEditor = dynamic(() => import('./BlocklyEditor'), {
  ssr: false
});
```

#### 3. Error de Tipos con topojson-client
```typescript
// Solución: Declarar módulo
declare module 'topojson-client' {
  export function feature(topology: any, object: any): any;
}
```

#### 4. Performance en Mapas
```typescript
// Solución: Memoización
const MapComponent = React.memo(() => {
  const [geoData, setGeoData] = useState(null);
  
  useEffect(() => {
    // Cargar datos una sola vez
    if (!geoData) {
      loadGeoData().then(setGeoData);
    }
  }, [geoData]);
  
  return <Map data={geoData} />;
});
```

## 📚 Recursos Adicionales

### Documentación
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Features](https://react.dev/blog/2024/04/25/react-19)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Blockly Developer](https://developers.google.com/blockly)

### Herramientas de Desarrollo
```bash
# Análisis de Bundle
npm install -g @next/bundle-analyzer

# Testing
npm install -D @testing-library/react @testing-library/jest-dom

# Linting adicional
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Extensiones VSCode Recomendadas
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier - Code formatter

---

## 📞 Soporte

Para preguntas sobre el código, arquitectura o implementación de nuevas características, consulta:

1. **CLAUDE.md** - Documentación técnica detallada para Claude
2. **Comentarios en código** - Explicaciones inline en componentes complejos
3. **Tests** - Ejemplos de uso y comportamiento esperado
4. **Estructura de tipos** - TypeScript interfaces como documentación viva

El proyecto está diseñado para ser extensible y mantenible, siguiendo patrones consistentes que facilitan el desarrollo colaborativo y la implementación de nuevas características educativas.

---

*ExplorAventura 3 - Educación interactiva con tecnología moderna* 🚀

# Resumen de depuración Mapamundi CCAA

## Problema
La validación de la selección de Comunidades Autónomas (CCAA) en el minijuego Mapamundi no era fiable debido a diferencias entre los códigos usados en el geojson (números) y los esperados por el sistema de preguntas (códigos de dos letras).

## Soluciones intentadas
- Validación por nombre de comunidad (normalizado).
- Validación por código de dos letras (mapeo numérico a letras).
- Validación por código numérico (mapeo de letras a número).
- Feedback siempre mostrando el valor numérico esperado.

## Estado actual
- La validación sigue fallando en algunos casos porque el sistema de preguntas espera letras y el geojson entrega números, y el mapeo no es 100% fiable para todos los casos.
- Se recomienda unificar el formato de los códigos en todo el sistema (o en las preguntas) para evitar ambigüedades.

## Recomendaciones
- Revisar la fuente de los datos de las preguntas.
- Unificar el formato de los códigos (todo numérico o todo letras).
- Si se mantiene el geojson, adaptar las preguntas para que esperen el mismo formato.