# ExplorAventura 3: Minijuegos Educativos

## 🎮 Descripción del Proyecto

ExplorAventura 3 es una plataforma educativa interactiva con **10 minijuegos**. Cada juego aborda una materia específica con mecánicas divertidas, XP y badges.

### ✨ Características Principales
- **10 Minijuegos Educativos**: Gramática, lectura, mates, geografía, programación, ciencias, historia, reciclaje, ortografía y astronomía
- **Sistema de Progreso**: XP, badges y seguimiento de avance
- **Multilingüe**: Soporte para español, catalán e inglés
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Persistencia**: Estado guardado automáticamente en localStorage
- **Navegación Intuitiva**: Dashboard centralizado con acceso fácil a todos los juegos

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
```
Frontend Framework: Next.js 15.3.4 (App Router)
Runtime: React 18.3.1
Language: TypeScript 5.8.3
Styling: Tailwind CSS 4
State Management: Zustand 5.0.6
Database: Supabase (configurada)
Internationalization: i18next + react-i18next (con I18nProvider propio)
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
│   │   ├── data/
│   │   │   ├── gameDataRegistry.ts   # Registro i18n es/ca/en
│   │   │   └── locales/{es,ca,en}/   # JSON pedagógicos por idioma
│   │   ├── hooks/
│   │   │   └── useNavigation.ts      # 🧭 Hook de navegación centralizado
│   │   ├── world/                    # 🌍 Directorio de minijuegos
│   │   │   ├── puerto-palabras/      # Gramática (drag & drop)
│   │   │   ├── bosc-lectura/         # Comprensión lectora
│   │   │   ├── mercado-numeros/      # Matemáticas aplicadas
│   │   │   ├── mision-mapamundi-v2/  # Geografía interactiva
│   │   │   ├── desafio-steam/        # Programación con bloques
│   │   │   ├── laboratorio-flip/     # Ciencias con videos
│   │   │   ├── museo-tiempo/         # Historia (línea temporal)
│   │   │   ├── fabrica-reciclaje/    # Medio ambiente (reciclaje)
│   │   │   ├── taller-ortografia/    # Ortografía (quiz)
│   │   │   └── planetario/           # Sistema Solar + exploración espacial (v2)
│   │   │       ├── page.tsx          # Selector de modo
│   │   │       ├── [mode]/           # planetas | exploracion
│   │   │       └── PlanetGame.tsx
│   │   ├── components/
│   │   │   └── I18nProvider.tsx      # 🌐 Proveedor de internacionalización (nuevo)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # 🏠 Dashboard principal
│   └── public/
│       └── locales/                  # 🌐 Archivos de traducción
│           ├── ca/common.json        # Catalán
│           ├── en/common.json        # Inglés
│           └── es/common.json        # Español
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── docs/
│   └── GAME_ARCHITECTURE.md          # 🏗️ Arquitectura (contrato stores, persistencia)
├── CLAUDE.md                         # 🤖 Guía para agentes IA
├── STEAM_GAME_DOCS.md                # 🤖 Detalle Blockly/robot
├── CHANGELOG.md                      # 📝 Versiones + plan histórico fases 0–7
└── README.md                         # 📖 Este archivo
```

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/GAME_ARCHITECTURE.md](docs/GAME_ARCHITECTURE.md) | **Referencia principal:** patrón de minijuegos, contrato de stores, persistencia |
| [CHANGELOG.md](CHANGELOG.md) | Historial de versiones + plan de implementación (fases 0–7) |
| [CLAUDE.md](CLAUDE.md) | Guía para agentes IA |
| [STEAM_GAME_DOCS.md](STEAM_GAME_DOCS.md) | Detalle Blockly/robot |

## 🆕 Historial de Cambios Recientes

> Detalle completo en [CHANGELOG.md](CHANGELOG.md).

### v3.3.2 (Julio 2026)
- Mapamundi: `data-region-id` en mapa; tests UI 100 % interacción
- v3.3.1: tests UI puros, ortografía 70 ítems (B/V, G/J)

### v3.2.0 (Julio 2026)
- **Fase 7:** Fábrica del Reciclaje, Taller de Ortografía, Planetario
- 10 minijuegos, 88 tests Jest, humo UI 10/10, i18n es/ca/en

### v3.0.0 (Julio 2026)
- **Infraestructura:** módulos compartidos (`shared/`, `useGameSession`)
- **6 juegos:** victoria/derrota, persistencia fiable, 46 tests
- **Docs:** `GAME_ARCHITECTURE.md`, CHANGELOG (plan fases 0–7)

### v2.0.0 (Diciembre 2024)
- **Desafío STEAM:** animaciones paso a paso, rastro visual, comunicación callback-based
- **Limpieza:** eliminación de STEAM v1 y archivos obsoletos

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

### 4. 🗺️ Misión Mapamundi
**Materia**: Geografía
**Ruta**: `/world/mision-mapamundi-v2`
**Mecánica**: Ubicar países, continentes y CCAA en mapas interactivos

#### Archivos Clave:
- `useMapamundiV2Store.ts` - Gestión de mapas y ubicaciones
- `WorldMap.tsx` - Mapa mundial interactivo
- `SpainMap.tsx` - Mapa de España con CCAA
- `Passport.tsx` - Sistema de pasaporte virtual
- `mapamundi-tasks.json` - Datos geográficos

#### Modos de Juego:
1. **CONTINENTES**: Identificar continentes en el mapa mundial
2. **OCEANOS**: Ubicar océanos principales
3. **CCAA**: Identificar Comunidades Autónomas de España

### 5. 🤖 Desafío STEAM
**Materia**: Programación y pensamiento computacional
**Ruta**: `/world/desafio-steam`
**Mecánica**: Programar un robot con bloques visuales

#### Archivos Clave:
- `useSteamStore.ts` - Lógica del robot y ejecución
- `BlocklyGame.client.tsx` - Editor de bloques visuales
- `BlocklyGame.tsx` - Wrapper para dynamic import
- `RobotBoard.tsx` - Tablero de juego del robot
- `blocks.ts` - Definición de bloques personalizados
- `steam-tasks.json` - 6 niveles de dificultad creciente

#### Características Técnicas:
- **Editor de Bloques**: Basado en Google Blockly con dynamic import
- **Ejecución en Tiempo Real**: El robot se mueve paso a paso según el código
- **Animaciones Suaves**: Transiciones de 300ms para movimientos, 200ms para giros
- **Feedback Visual**: Indicadores de estado (ejecutando, crash, éxito)
- **Sistema de Vidas**: 3 vidas por nivel
- **Límite de Bloques**: Optimización de código por nivel
- **Persistencia**: Código guardado automáticamente en localStorage

#### Experiencia del Jugador:
1. **Pantalla de Instrucciones**: Tutorial interactivo con objetivos claros
2. **Editor Visual**: Bloques drag & drop para programar el robot
3. **Ejecución Animada**: Movimiento paso a paso visible en tiempo real
4. **Feedback Inmediato**: 
   - Robot cambia a 💥 si choca
   - Celda se vuelve roja al colisionar
   - Meta rebota durante la ejecución
   - Indicadores de estado claros
5. **Sistema de Progreso**: XP y badges por completar niveles

#### Comandos del Robot:
- **`avanzar()`**: Mueve el robot 1 casilla en la dirección actual
- **`girarIzquierda()`**: Rota el robot 90° a la izquierda
- **`girarDerecha()`**: Rota el robot 90° a la derecha
- **`repetir(n, acciones)`**: Ejecuta acciones n veces

#### Niveles de Dificultad:
1. **Nivel 1**: Movimiento básico (máx. 3 bloques)
2. **Nivel 2**: Giros y obstáculos (máx. 4 bloques)
3. **Nivel 3**: Bucles simples (máx. 5 bloques)
4. **Nivel 4**: Patrones complejos (máx. 6 bloques)
5. **Nivel 5**: Optimización avanzada (máx. 7 bloques)
6. **Nivel 6**: Desafío final (máx. 8 bloques)

### 6. 🧪 Laboratorio Flip-Ciencia
**Materia**: Ciencias
**Ruta**: `/world/laboratorio-flip`
**Mecánica**: Ver videos educativos y responder quiz

#### Archivos Clave:
- `useLaboratorioFlipStore.ts` - Gestión de lecciones
- `VideoCard.tsx` - Reproductor de videos
- `Quiz.tsx` - Sistema de preguntas
- `flip-lessons.json` - Lecciones científicas

#### Flujo del Juego:
1. Selección de lección científica
2. Visualización de video educativo
3. Quiz de comprensión
4. Feedback detallado con explicaciones
5. Sistema de progreso por materia

### 7. 🏛️ Museo del Tiempo
**Materia**: Historia  
**Ruta**: `/world/museo-tiempo`  
**Mecánica**: Ordenar 8 eventos históricos en línea temporal (drag-and-drop)

- **Store**: `useMuseoTiempoStore` · **Datos**: `museo-events.json` (24 eventos, es/ca/en)
- **Badge**: Historiador Junior · **Persistencia**: `museo-tiempo-storage`

### 8. ♻️ Fábrica del Reciclaje
**Materia**: Medio ambiente  
**Ruta**: `/world/fabrica-reciclaje`  
**Mecánica**: Clasificar residuos en 5 contenedores (drag-and-drop)

- **Store**: `useFabricaReciclajeStore` · **Datos**: `fabrica-reciclaje-items.json` (48 ítems)
- **Badge**: Eco-Héroe Junior · **Meta**: 8 clasificaciones correctas

### 9. ✏️ Taller de Ortografía
**Materia**: Lengua / ortografía  
**Ruta**: `/world/taller-ortografia`  
**Mecánica**: Completar frases con hueco (quiz, 8 preguntas, 5 corazones)

- **Store**: `useTallerOrtografiaStore` · **Componente**: `SpellingGame.tsx`
- **Datos**: `taller-ortografia-items.json` (70 ítems) · **Badge**: Maestro de la Ortografía

### 10. 🪐 Planetario
**Materia**: Ciencias (Sistema Solar y exploración espacial)  
**Rutas**: `/world/planetario` (selector) · `/world/planetario/planetas` · `/world/planetario/exploracion`  
**Mecánica**: Ordenar tarjetas en línea temporal (drag-and-drop)

- **Modos**: `planetas` (8 planetas) · `exploracion` (8 hitos cronológicos)
- **Store**: `usePlanetarioStore` · **Datos**: `planetario-bodies.json` (planetas + hitos)
- **Badges**: Astrónomo Junior · Explorador Espacial · **Persistencia**: `planetario-storage`

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 20.x o superior
- npm o yarn

### Pasos de instalación

1. **Instala las dependencias**:
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el entorno de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia en modo producción |
| `npm run lint` | Ejecuta el linter de código |
| `npm test` | Tests Jest (stores + shared) |
| `npm run test:ci` | Tests con cobertura (umbral 60 %) |
| `npm run test:ui` | Humo Playwright de los 10 minijuegos (requiere `npm run start`) |
| `npm run supabase:start` | Inicia Supabase local |
| `npm run supabase:stop` | Detiene Supabase local |
| `npm run db:reset` | Resetea la base de datos |
| `npm run db:push` | Aplica migraciones |
| `npm run types:generate` | Genera tipos TypeScript |

## 🌐 Despliegue en Vercel

El proyecto está optimizado para despliegue automático en Vercel:

1. **Conecta tu repositorio** en [Vercel](https://vercel.com/)
2. **Selecciona la carpeta** `aventura-multimateria` como raíz del proyecto
3. **Vercel detectará automáticamente** la configuración de Next.js
4. **El despliegue se ejecutará** automáticamente en cada push a la rama principal

### Configuración de Vercel
- **Framework Preset**: Next.js
- **Root Directory**: `aventura-multimateria`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## 🎯 Características Principales

- **Responsive Design**: Optimizado para móviles y tablets
- **Internacionalización**: Soporte multiidioma (ES, EN, CA)
- **Editor de Bloques**: Programación visual con Blockly
- **Mapas Interactivos**: Geografía con react-leaflet
- **Drag & Drop**: Interacciones intuitivas
- **Gestión de Estado**: Zustand para estado global
- **Optimización**: Lazy loading y code splitting

## 🔧 Configuración del Entorno

### Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 📝 Licencia

Este proyecto es de uso educativo y puede ser modificado según las necesidades del equipo.

---

**Desarrollado con ❤️ para el aprendizaje interactivo**