# ExplorAventura 3: Minijuegos Educativos

## Descripción del Proyecto
ExplorAventura 3 es una plataforma de minijuegos educativos en Next.js 15 + React 18. Incluye **10 minijuegos**: gramática, lectura, mates, geografía, programación, ciencias, historia, reciclaje, ortografía y astronomía.

## Arquitectura del Proyecto

### Stack Tecnológico
- **Framework**: Next.js 15.3.4 con App Router
- **Runtime**: React 18.3.1
- **Lenguaje**: TypeScript 5.8.3
- **Estilos**: Tailwind CSS 4
- **Estado**: Zustand 5.0.6 con persistencia en localStorage
- **Base de datos**: Supabase (configurada pero no utilizada activamente)
- **Internacionalización**: next-i18next 15.4.2
- **Iconos**: lucide-react 0.525.0
- **Mapas**: react-simple-maps 3.0.0 con topojson-client 3.1.0
- **Programación visual**: blockly 12.1.0
- **Video**: react-player 3.1.0

### Estructura de Directorios
```
src/
├── app/
│   ├── data/
│   │   ├── gameDataRegistry.ts
│   │   └── locales/{es,ca,en}/  # JSON pedagógicos (7 archivos × 3 idiomas)
│   ├── hooks/
│   │   └── useNavigation.ts     # Hook de navegación centralizado
│   ├── world/                   # Directorio de minijuegos
│   │   ├── puerto-palabras/     # Minijuego de gramática
│   │   ├── bosc-lectura/        # Minijuego de lectura comprensiva
│   │   ├── mercado-numeros/     # Minijuego de matemáticas
│   │   ├── mision-mapamundi-v2/ # Minijuego de geografía
│   │   ├── desafio-steam/       # Minijuego de programación
│   │   └── laboratorio-flip/    # Minijuego de ciencias
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Dashboard principal
└── public/
    └── locales/                 # Archivos de traducción
        ├── ca/common.json       # Catalán
        ├── en/common.json       # Inglés
        └── es/common.json       # Español
```

### Patrones de Desarrollo

> **Documento de referencia:** ver [docs/GAME_ARCHITECTURE.md](docs/GAME_ARCHITECTURE.md) para el contrato completo de stores, persistencia, ciclo de partida y checklist de juegos nuevos.

#### 1. Estructura de Minijuego
Cada minijuego sigue una estructura consistente:
```
minijuego/
├── types.ts                 # Interfaces TypeScript
├── useMinijuegoStore.ts     # Store de Zustand
├── page.tsx                 # Página principal con pantallas de instrucciones y juego
├── ComponenteEspecifico.tsx # Componentes específicos del juego
└── data.json               # Datos del juego (en /app/data/)
```

#### 2. Store de Zustand
Todos los stores siguen este patrón:
- Estado persistente en localStorage
- Funciones para inicializar, actualizar estado y manejar feedback
- Sistema de XP y badges
- Pantallas de instrucciones (`showInstructions`)

#### 3. Navegación
- Hook `useNavigation` centralizado
- Función `goToDashboard()` en todos los minijuegos
- Botón "Dashboard" consistente en headers

#### 4. Sistema de Feedback
Todos los juegos implementan:
- Modales de feedback con éxito/error
- Animaciones y transiciones suaves
- Sistema de recompensas (XP, badges)

## Minijuegos Implementados

### 1. Puerto de las Palabras 🎮
**Ruta**: `/world/puerto-palabras`
**Materia**: Gramática
**Mecánica**: Drag & drop de palabras en categorías
- **Componentes**: DragDropGame, WordCard, CategoryBox
- **Datos**: 50+ palabras categorizadas (sustantivos, verbos, adjetivos)
- **Store**: `usePuertoPalabrasStore`

### 2. Bosc de Lectura 📖
**Ruta**: `/world/bosc-lectura`
**Materia**: Lectura comprensiva
**Mecánica**: Leer textos y responder preguntas
- **Componentes**: ReadingGame, PassageDisplay, QuestionCard
- **Datos**: 15+ textos con preguntas múltiple opción
- **Store**: `useBoscLecturaStore`

### 3. Mercado de Números 🧮
**Ruta**: `/world/mercado-numeros`
**Materia**: Matemáticas
**Mecánica**: Resolver problemas de dinero, tiempo y fracciones
- **Componentes**: PaymentChallenge, TimeChallenge, FractionChallenge
- **Datos**: 100 tareas balanceadas en 3 tipos
- **Store**: `useMercadoNumerosStore`

### 4. Misión Mapamundi 🗺️
**Ruta**: `/world/mision-mapamundi-v2`
**Materia**: Geografía
**Mecánica**: Localizar lugares en mapas interactivos
- **Componentes**: WorldMap, SpainMap, Passport (react-simple-maps)
- **Datos**: Ubicaciones (continentes, océanos, comunidades autónomas)
- **Store**: `useMapamundiV2Store`

### 5. Desafío STEAM 🤖
**Ruta**: `/world/desafio-steam`
**Materia**: Programación
**Mecánica**: Programar robot con bloques visuales
- **Componentes**: RobotBoard, BlocklyGame.client.tsx, BlocklyGame.tsx (wrapper)
- **Datos**: 6 desafíos progresivos en tablero 6x6
- **Store**: `useSteamStore`
- **Dependencias**: blockly para programación visual
- **Características especiales**: 
  - Renderizado solo en cliente para evitar problemas SSR
  - Parser de código seguro sin eval()
  - Sistema de notificaciones integrado
  - Inicialización robusta con verificación de dimensiones DOM
  - **Animaciones mejoradas**: Movimiento paso a paso con timing optimizado
  - **Feedback visual**: Estados de ejecución, crash y éxito con animaciones CSS
  - **Comunicación entre componentes**: Callback-based para funciones del editor
  - **Persistencia**: Código guardado automáticamente en localStorage
  - **Sistema de vidas**: 3 vidas por nivel con reinicio automático
  - **Límites de bloques**: Validación en tiempo real por nivel

### 6. Laboratorio Flip-Ciencia 🧪
**Ruta**: `/world/laboratorio-flip`
**Materia**: Ciencias
**Mecánica**: Ver videos educativos y responder quiz
- **Componentes**: VideoCard (react-player), Quiz
- **Datos**: 16 lecciones científicas con videos y preguntas
- **Store**: `useLaboratorioFlipStore`
- **Dependencias**: react-player para reproducción de video

## Comandos de Desarrollo

### Instalación
```bash
npm install
# Si hay conflictos de dependencias:
npm install --legacy-peer-deps
```

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo en localhost:3000
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
```

### Supabase (Opcional)
```bash
npm run supabase:start    # Iniciar Supabase local
npm run supabase:stop     # Detener Supabase local
npm run db:reset          # Resetear base de datos
npm run db:push           # Aplicar cambios de schema
npm run types:generate    # Generar tipos TypeScript
```

## Configuraciones Importantes

### Next.js Config
- App Router habilitado
- PWA configurado
- Internacionalización con next-i18next

### Dependencias Críticas
- **React 18**: Usar `--legacy-peer-deps` para react-simple-maps
- **Blockly**: 
  - Renderizado solo en cliente (archivo .client.tsx)
  - Usar `setTimeout` para inicialización DOM-dependiente
  - Verificar dimensiones del contenedor antes de inyectar
  - Manejar cleanup adecuado en unmount
- **ReactPlayer**: Importar con `dynamic` y `ssr: false`

### Persistencia
- Objetivo: Zustand con middleware `persist` en **todos** los minijuegos
- Estado actual (julio 2026): persistencia completa o parcial solo en Mapamundi, STEAM y Laboratorio Flip; ver tabla en `docs/GAME_ARCHITECTURE.md` §5.3
- Claves en uso:
  - `bosc-session` (manual, solo escritura — migrar a persist)
  - `mapamundi-v2-session`
  - `steam-v2-storage`
  - `laboratorio-flip-storage`
- Claves objetivo pendientes: `puerto-palabras-storage`, `bosc-lectura-storage`, `mercado-numeros-storage`
- **Regla:** no llamar `initializeGame()` / `loadWords()` / `loadTasks()` en montaje si hay sesión activa

## Extensibilidad

### Añadir Nuevo Minijuego
Seguir el checklist completo en [docs/GAME_ARCHITECTURE.md §14](docs/GAME_ARCHITECTURE.md#14-checklist-añadir-un-minijuego-nuevo). Resumen:

1. **Crear directorio**: `/src/app/world/nuevo-juego/`
2. **Crear archivos base**: `types.ts`, `useNuevoJuegoStore.ts` (con `persist`), `page.tsx`, componentes
3. **Añadir datos**: JSON en `/src/app/data/`
4. **Implementar ciclo completo**: instrucciones → playing → completed/failed
5. **Actualizar dashboard**: `/src/app/page.tsx`
6. **Traducciones**: `/public/locales/{es,ca,en}/`
7. **Tests**: `__tests__/useNuevoJuegoStore.test.ts`

## Actualizaciones Recientes

### Limpieza del Proyecto
- **Eliminación de STEAM v1**: Se removió la versión duplicada del juego STEAM
- **Optimización de código**: Eliminación de archivos obsoletos y dependencias innecesarias
- **Actualización de documentación**: README y CLAUDE.md actualizados
- **Mejora de rendimiento**: Optimización de carga y renderizado

### Cambios Técnicos
- **Desafío STEAM**: Ahora usa `BlocklyGame.client.tsx` para evitar problemas SSR
- **Estructura de archivos**: Actualizada para reflejar la nueva organización
- **Documentación**: Completamente actualizada con información actual