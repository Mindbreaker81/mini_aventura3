# REVISIÓN COMPLETA DEL REPOSITORIO - ExplorAventura 3

**Fecha**: Abril 2026  
**Proyecto**: ExplorAventura 3 - Minijuegos Educativos  
**Tecnologías**: Next.js 15, React 18, TypeScript, Zustand  
**Target**: Niños de 8-9 años

---

## 1. INSTALACIÓN Y EJECUCIÓN

### Estado General
- **Build**: ✅ Compila correctamente (Next.js 15.5.7)
- **Lint**: ✅ Sin errores de ESLint
- **TypeScript**: ❌ 30+ errores de tipado detectados
- **Dependencias**: ⚠️ 17 vulnerabilidades de seguridad (12 altas)

### Problemas Detectados

| Problema | Severidad | Ubicación |
|----------|-----------|-----------|
| Dependencias con vulnerabilidades | ALTA | `package.json` - `d3-color`, `flatted`, etc. |
| TypeScript errors en producción | ALTA | Múltiples archivos |
| Test dependencies faltantes | MEDIA | `@testing-library/react`, `@types/jest` |
| Lockfiles duplicados | BAJA | Raíz y subdirectorio conflicto |

### Comandos Verificados
```bash
npm install       # ✅ Funciona (525 paquetes)
npm run build     # ✅ Compila con warnings
npm run lint      # ✅ Sin errores
npx tsc --noEmit  # ❌ 30+ errores
```

---

## 2. FUNCIONAMIENTO GENERAL

### Navegación
- **Dashboard**: ✅ Funcional, muestra 6 minijuegos
- **Rutas**: ✅ Todas las rutas configuradas correctamente
- **Navegación**: ⚠️ Usa `window.location.href = '/'` en vez de router

### Estados de Carga/Error
- **Sin skeletons**: No hay estados de carga visual
- **Sin error boundaries**: No hay manejo de errores global
- **Persistencia**: ✅ Zustand con localStorage funciona

---

## 3. MINIJUEGOS - ANÁLISIS DETALLADO

### 3.1 Puerto de las Palabras ⭐

**Qué hace**: Drag-and-drop de palabras a categorías gramaticales

**Lógica**:
- ✅ Store bien implementado con deduplicación
- ✅ Feedback inmediato con reglas ortográficas
- ⚠️ No hay fin de juego claro (repara 6 partes pero hay 10 palabras)
- ❌ SVG sin título accesible

**Problemas**:
| Archivo | Línea | Problema |
|---------|-------|----------|
| `page.tsx` | 137 | `tabIndex={0}` sin `onKeyDown` |
| `page.tsx` | 30-44 | SVG `<BarcoSVG>` sin `<title>` |
| `usePuertoPalabrasStore.ts` | 36 | No baraja correctamente (fisher-yates inseguro) |

**Adecuación 8-9 años**: ✅ Excelente

---

### 3.2 Bosc de Lectura 📖

**Qué hace**: Lectura comprensiva en catalán con preguntas

**Lógica**:
- ✅ Sistema de vidas (5 corazones)
- ✅ Único juego con i18n implementado
- ⚠️ Solo 6 pasajes (contenido limitado)
- ❌ Sin botón de "siguiente pasaje" automático

**Problemas**:
| Archivo | Línea | Problema |
|---------|-------|----------|
| `ReadingGame.tsx` | 177,191 | `tabIndex={0}` sin keyboard handler |
| `page.tsx` | 31 | Hardcoded `lang="en"` debería ser `"es"` |

**Datos**: Contenido en catalán, sin traducción a español

---

### 3.3 Mercado de Números 🧮

**Qué hace**: Problemas matemáticos de dinero, tiempo y fracciones

**Lógica**:
- ✅ 3 tipos de retos bien diferenciados
- ✅ Sistema de vidas y cestas
- ⚠️ Schema inconsistente en FRACCION (algunas con `answer`, otras con `options`)
- ❌ Límite de 10€ hardcodeado en `selectCoin`

**Problemas**:
| Archivo | Línea | Problema |
|---------|-------|----------|
| `useMercadoNumerosStore.ts` | 69 | Límite hardcodeado `if (total <= 10)` |
| `PaymentChallenge.tsx` | 98 | `<Trash2>` sin aria-label |
| `mercado-tasks.json` | 274+ | Schema inconsistente |

**Bug potencial**: Si una tarea requiere más de 10€, el jugador no puede completarla

---

### 3.4 Misión Mapamundi 🗺️

**Qué hace**: Localizar continentes, océanos y CCAA en mapas interactivos

**Lógica**:
- ✅ 3 modos de juego independientes
- ✅ Persistencia con Zustand
- ❌ TypeScript errors críticos en mapas
- ❌ Sin manejo de undefined en properties

**Problemas**:
| Archivo | Línea | Problema |
|---------|-------|----------|
| `SpainMap.tsx` | 56,68 | `undefined` usado como índice |
| `WorldMap.tsx` | 128,141,164 | Posible undefined en acceso |
| `WorldMap.tsx` | 261 | `geo.properties` posiblemente undefined |
| `[mode]/page.tsx` | 23 | Type `'string'` no asignable a `GameMode` |

**Critical**: Los errores de TypeScript causarán crashes en producción

---

### 3.5 Desafío STEAM 🤖

**Qué hace**: Programar robot con bloques visuales (Blockly)

**Lógica**:
- ✅ Animación paso a paso del robot
- ✅ Persistencia del código
- ⚠️ Ejecuta código con `new Function()` (potencialmente inseguro si hay input externo)
- ❌ Múltiples TypeScript errors con Blockly

**Problemas**:
| Archivo | Línea | Problema |
|---------|-------|----------|
| `BlocklyGame.client.tsx` | 88,142,173 | Type mismatch con `JavascriptGenerator` |
| `page.tsx` | 7 | No exported member `BlocklyGameRef` |
| `useSteamStore.ts` | 170 | `new Function()` ejecución de código |
| `RobotBoard 2.tsx` | 22+ | Archivo duplicado con errores (debería eliminarse) |

**Seguridad**: El uso de `new Function()` es seguro aquí porque el código viene solo de Blockly blocks, pero debería documentarse

---

### 3.6 Laboratorio Flip-Ciencia 🧪

**Qué hace**: Ver videos educativos y responder quiz

**Lógica**:
- ✅ Sistema de piezas del experimento
- ⚠️ Depende de videos de YouTube externos
- ❌ TypeScript error en `onProgress` de VideoPlayer
- ❌ `getCorrectAnswersCount` puede retornar `null`

**Problemas**:
| Archivo | Línea | Problema |
|---------|-------|----------|
| `VideoCard.tsx` | 180 | `onProgress` type mismatch |
| `useLaboratorioFlipStore.ts` | 215,221 | Posible null en count |
| `flip-lessons.json` | - | Referencias a archivos .vtt y .jpg que pueden no existir |

---

## 4. UI/UX INFANTIL

### Aspectos Positivos ✅
- Emojis extensivos para hacer la interfaz amigable
- Colores vibrantes y atractivos
- Instrucciones claras y numeradas
- Feedback inmediato con mensajes motivadores
- Tamaño de botones adecuado para niños

### Problemas Identificados ⚠️

| Aspecto | Problema | Archivo |
|---------|----------|---------|
| Feedback visual | No hay animaciones de éxito ("confetti", etc.) | Todos los juegos |
| Sonido | Sin efectos de sonido | Global |
| Progreso | No hay barra de progreso visual en Puerto Palabras | `puerto-palabras/page.tsx` |
| Instrucciones | "CCAA España" es término muy técnico para niños | `mision-mapamundi-v2/page.tsx:27` |
| Botones | Algunos botones de "Volver" usan navegación forzada | `desafio-steam/page.tsx:106` |

### Recomendaciones UI/UX
1. Añadir barra de progreso visual en todos los juegos
2. Considerar efectos de sonido para feedback
3. Cambiar "CCAA España" por "Comunidades de España"
4. Añadir animaciones de celebración al completar juegos

---

## 5. ACCESIBILIDAD

### Problemas Críticos

| Categoría | Problema | Ubicación |
|-----------|----------|-----------|
| **Teclado** | Elementos con `tabIndex` sin `onKeyDown` | `ReadingGame.tsx:177,191,208,225` |
| **Teclado** | Divs clickeables sin `role="button"` | `VideoCard.tsx:144` |
| **ARIA** | Botones con solo icono sin `aria-label` | `PaymentChallenge.tsx:98` |
| **ARIA** | SVGs informativos sin `<title>` | `puerto-palabras/page.tsx:30-44` |
| **ARIA** | Grupos de radio sin `<fieldset>` | `ReadingGame.tsx:184-196` |
| **Focus** | No hay manejo de foco en modales | Todos los juegos con feedback modal |
| **Idioma** | `lang="en"` debería ser `"es"` | `layout.tsx:31` |

### Ejemplos de Código

**Navegación por teclado**:
```tsx
// Problema actual:
<span tabIndex={0} role="button" aria-label={w.word}>
  {w.word}
</span>

// Solución:
<span 
  tabIndex={0} 
  role="button" 
  aria-label={w.word}
  onKeyDown={(e) => e.key === 'Enter' && handleDrop()}
>
  {w.word}
</span>
```

**Modales sin focus trap**:
```tsx
// Los modales necesitan:
<div 
  ref={modalRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="feedback-title"
  tabIndex={-1}
>
```

---

## 6. CALIDAD DE CÓDIGO

### Estructura ✅
- Arquitectura consistente: `page.tsx` + `useXxxStore.ts` + componentes
- Separación clara de responsabilidades
- Stores de Zustand bien estructurados

### Problemas de Código

**Duplicación**:
- Archivo `RobotBoard 2.tsx` es duplicado obsoleto

**TypeScript Issues**:
- 30+ errores de tipado
- Tipos inconsistentes entre componentes

**Seguridad**:
```typescript
// useSteamStore.ts:170 - Potencialmente peligroso
const func = new Function('move', 'turnLeft', 'turnRight', 
  `return (async () => { ${code} })();`);
```

**Patrones**:
```typescript
// Navegación inconsistente:
window.location.href = '/';  // En steam/page.tsx:106,162,186
goToDashboard();             // En otros juegos
```

### Cobertura de Tests
- **Tests existentes**: 1 archivo (`page.test.tsx`)
- **Tests faltantes**: 0 tests para stores, 0 tests para componentes de juego
- **Dependencias faltantes**: `@testing-library/react`, `@types/jest`

---

## 7. TESTS

### Estado Actual
| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `page.test.tsx` | 2 | Dashboard básico |

### Tests Faltantes (Prioridad)
1. **Stores** - Testear lógica de cada store
2. **Componentes de juego** - Testear interacciones
3. **Utilidades** - Testear `dragdrop-utils`, `blockly-utils`
4. **Integración** - Testear flujos completos

---

## 8. RENDIMIENTO Y ROBUSTEZ

### Memory Leaks Potenciales

| Archivo | Línea | Problema |
|---------|-------|----------|
| `BlocklyGame.client.tsx` | 37-48 | Intervalo está limpiado correctamente |
| `useSteamStore.ts` | 107-149 | Delays sin cleanup en `executeCode` |

### Renders Innecesarios
- No se usa `React.memo` en componentes pesados
- Los stores de Zustand podrían usar selectores más específicos

### Dependencias Peligrosas
```
d3-color < 3.1.0         # ReDoS vulnerability
flatted <= 3.4.1         # Prototype Pollution
brace-expansion < 2.0.3  # Memory exhaustion
```

---

## 8.1 RENDIMIENTO EN DISPOSITIVOS ESCOLARES

### Core Web Vitals y Bundle Size
- **Sin análisis de Lighthouse**: No se han medido LCP, CLS ni INP
- **Librerías pesadas**: Blockly (~800KB) y react-leaflet + topojson añaden peso significativo al bundle
- **Dispositivos escolares**: Los ordenadores de colegios suelen ser de gama baja con RAM y CPU limitados
- **Recomendación**: Ejecutar Lighthouse en modo mobile con CPU throttling 4x para simular condiciones reales

### Responsividad Móvil/Tablet
- **Sin análisis de responsive design**: Los niños de 8-9 años frecuentemente usan tablets
- **Drag-and-drop táctil**: `@hello-pangea/dnd` soporta touch, pero no se ha verificado la experiencia en pantallas pequeñas
- **Mapas interactivos**: react-leaflet en pantallas táctiles puede tener problemas de zoom/scroll
- **Recomendación**: Testear en tablets reales (iPad, tablets Android baratas) y verificar breakpoints de Tailwind

---

## 8.2 PRIVACIDAD Y CUMPLIMIENTO NORMATIVO (RGPD/LOPD)

### Datos de Menores
- **Crítico**: La app está dirigida a menores de 14 años, lo que activa protecciones especiales bajo RGPD y LOPD
- **localStorage**: Se almacenan datos de progreso, puntuaciones y estado de juego sin consentimiento explícito
- **Supabase (opcional)**: Si se activa, los datos de menores se transmitirían a servidores externos
- **Sin política de privacidad**: No existe página de política de privacidad ni banner de consentimiento

### Recomendaciones
1. Verificar que localStorage no almacena datos personales identificables
2. Si se usa Supabase, requerir consentimiento parental
3. Añadir política de privacidad adaptada a menores
4. Evaluar si se necesita Delegado de Protección de Datos

---

## 8.3 COMPATIBILIDAD DE NAVEGADORES

### Sin Matriz de Compatibilidad
- **Navegadores escolares**: Muchos colegios usan Chrome gestionado, Firefox ESR o incluso Edge antiguo
- **Chromebooks**: Comunes en entornos educativos, rendimiento limitado
- **Blockly**: Requiere navegadores modernos con buen soporte de SVG
- **Recomendación**: Definir una matriz de navegadores mínimos y testear con BrowserStack o similar

---

## 8.4 FUNCIONAMIENTO OFFLINE Y REDES INESTABLES

### Dependencia de Red
- **Videos de YouTube**: Laboratorio Flip depende 100% de conexión a internet para los videos educativos
- **Mapas**: react-leaflet carga tiles desde servidores externos
- **Sin Service Worker**: No hay estrategia PWA ni caché de recursos
- **Redes escolares**: Frecuentemente inestables, con filtros de contenido que pueden bloquear YouTube

### Recomendaciones
1. Añadir fallback offline para Laboratorio Flip (al menos mostrar el contenido textual)
2. Considerar tiles de mapa cacheados para Misión Mapamundi
3. Evaluar implementación de Service Worker para recursos estáticos
4. Testear con throttling de red (3G lento) para simular condiciones reales

---

## 8.5 GESTIÓN MULTI-USUARIO

### Problema Actual
- **Un solo perfil por dispositivo**: localStorage no distingue entre usuarios
- **Conflicto de datos**: Si varios alumnos comparten un ordenador, sus progresos se mezclan
- **Sin sistema de login**: No hay autenticación ni selección de perfil

### Recomendaciones
1. Implementar selector de perfil simple (nombre + avatar, sin contraseña)
2. Usar prefijos en localStorage por usuario (`user_1_puertoScore`, etc.)
3. Si se activa Supabase, vincular progresos a cuentas

---

## 8.6 DURACIÓN Y CONSUMO DE CONTENIDO

### Análisis de Horas de Juego Estimadas

| Juego | Contenido | Duración estimada | Rejugabilidad |
|-------|-----------|-------------------|---------------|
| Puerto Palabras | 91 palabras, 6 niveles | ~30-45 min | Media (mismo pool) |
| Bosc Lectura | 6 pasajes | ~15-20 min | Baja (se memorizan) |
| Mercado Números | 134 tareas, 3 tipos | ~1-2 horas | Media |
| Misión Mapamundi | 27 tareas, 3 modos | ~45-60 min | Baja |
| STEAM | 6 niveles | ~1-2 horas | Alta (programación libre) |
| Laboratorio Flip | 16 lecciones | ~2-3 horas | Baja |

**Total estimado**: ~5-8 horas de contenido único
**Riesgo**: Un alumno motivado puede agotar todo el contenido en 2-3 sesiones escolares

### Recomendaciones
1. Ampliar Bosc Lectura a mínimo 15-20 pasajes
2. Añadir generación procedural de tareas en Mercado Números
3. Considerar sistema de contenido ampliable por el profesor

---

## 8.7 MONITOREO Y CI/CD

### Monitoreo en Producción
- **Sin error tracking**: No hay integración con Sentry, LogRocket o similar
- **Sin analytics**: No se miden métricas de uso ni engagement por juego
- **Sin alertas**: Los crashes en producción pasarían desapercibidos

### CI/CD
- **Sin pipeline**: No hay GitHub Actions, Vercel CI ni similar configurado
- **Sin checks automáticos**: TypeScript, lint y tests no se ejecutan en PRs
- **Recomendación**: Configurar GitHub Actions con: `tsc --noEmit`, `eslint`, `npm run build`

---

## 9. PRIORIZACIÓN DE HALLAZGOS

### CRÍTICO (Bloqueante para producción)

| # | Problema | Impacto | Archivo |
|---|----------|---------|---------|
| C1 | TypeScript errors causarán crashes | Alto | `SpainMap.tsx`, `WorldMap.tsx`, `VideoCard.tsx` |
| C2 | Vulnerabilidades npm (12 high) | Alto | `package.json` |
| C3 | Laboratorio: `getCorrectAnswersCount` retorna null | Alto | `useLaboratorioFlipStore.ts:215` |
| C4 | Schema inconsistente en `mercado-tasks.json` | Medio | `mercado-tasks.json` |

### ALTO (Degradación significativa)

| # | Problema | Impacto | Archivo |
|---|----------|---------|---------|
| A1 | Accesibilidad: navegación por teclado rota | Medio | Múltiples |
| A2 | lang="en" debería ser "es" | Medio | `layout.tsx:31` |
| A3 | Archivo duplicado `RobotBoard 2.tsx` | Bajo | Debe eliminarse |
| A4 | Export faltante `BlocklyGameRef` | Medio | `BlocklyGame.ts` |
| A5 | Videos externos de YouTube sin fallback | Medio | `flip-lessons.json` |
| A6 | Sin cumplimiento RGPD/LOPD para menores | Alto | Global |
| A7 | Sin gestión multi-usuario (localStorage compartido) | Medio | Stores |

### MEDIO (Problemas de calidad)

| # | Problema | Impacto | Archivo |
|---|----------|---------|---------|
| M1 | I18n mínimo, textos hardcodeados | Bajo | 5 de 6 juegos |
| M2 | Tests inexistentes | Bajo | Global |
| M3 | Datos duplicados en `puerto-words.json` | Bajo | Líneas 5,29,65 |
| M4 | Navegación inconsistente | Bajo | `window.location` vs `goToDashboard()` |
| M5 | Sin error boundary global | Bajo | Aplicación completa |
| M6 | Sin CI/CD ni pipeline de checks automáticos | Medio | GitHub Actions |
| M7 | Sin monitoreo en producción (Sentry, etc.) | Medio | Global |
| M8 | Sin análisis de rendimiento (Lighthouse/Core Web Vitals) | Medio | Global |

### BAJO (Mejoras sugeridas)

| # | Problema | Impacto | Archivo |
|---|----------|---------|---------|
| B1 | Sin animaciones de éxito | Bajo | UI global |
| B2 | Contenido limitado (6 pasajes en Bosc) | Bajo | `bosc-passages.json` |
| B3 | Terminología técnica "CCAA" | Bajo | `mision-mapamundi-v2` |
| B4 | Archivo `minigames_config.json` incompleto | Bajo | Parece abandonado |
| B5 | Sin testing en tablets/móviles | Bajo | Responsive design |
| B6 | Sin compatibilidad offline/PWA | Bajo | Service Worker |
| B7 | Sin matriz de compatibilidad de navegadores | Bajo | Global |

---

## RESUMEN EJECUTIVO

### Estado General
La aplicación está **funcionalmente completa** pero tiene **problemas técnicos críticos** que deben resolverse antes de pruebas con niños.

### Puntos Fuertes ✅
1. Arquitectura bien diseñada y consistente
2. 6 minijuegos educativos completos y funcionales
3. Contenido pedagógico apropiado para 8-9 años
4. Sistema de persistencia robusto (Zustand + localStorage)
5. Interfaz visual atractiva y colorida
6. Build funciona correctamente

### Puntos Débiles ❌
1. 30+ errores de TypeScript causarán crashes
2. Accesibilidad insuficiente para uso educativo
3. Vulnerabilidades de seguridad en dependencias
4. Tests prácticamente inexistentes
5. Internacionalización mínima (solo 1 de 6 juegos)
6. Sin cumplimiento RGPD/LOPD para menores
7. Sin gestión multi-usuario en dispositivos compartidos
8. Sin CI/CD ni monitoreo en producción
9. Dependencia total de internet para videos y mapas

---

## TOP 10 PROBLEMAS

| # | Problema | Severidad | Esfuerzo |
|---|----------|-----------|----------|
| 1 | TypeScript errors en mapas causarán crashes | Crítico | Medio |
| 2 | Vulnerabilidades npm de seguridad | Crítico | Bajo |
| 3 | Navegación por teclado rota | Alto | Medio |
| 4 | `getCorrectAnswersCount` puede retornar null | Crítico | Bajo |
| 5 | Schema inconsistente en fracciones | Alto | Bajo |
| 6 | Botones sin aria-label accesible | Alto | Bajo |
| 7 | Videos YouTube sin fallback | Alto | Medio |
| 8 | Test coverage inexistente | Medio | Alto |
| 9 | I18n mínimo | Medio | Alto |
| 10 | Archivo duplicado `RobotBoard 2.tsx` | Medio | Bajo |

---

## QUICK WINS (Mejoras rápidas)

| # | Mejora | Tiempo | Impacto |
|---|--------|--------|---------|
| 1 | `npm audit fix` + actualizar dependencias | 10min | Alto |
| 2 | Eliminar `RobotBoard 2.tsx` | 2min | Bajo |
| 3 | Cambiar `lang="en"` a `lang="es"` | 1min | Medio |
| 4 | Añadir `aria-label` a botones de iconos | 30min | Alto |
| 5 | Fix TypeScript errors en stores | 1h | Crítico |
| 6 | Cambiar "CCAA" por "Comunidades" | 5min | Bajo |
| 7 | Eliminar duplicados en `puerto-words.json` | 10min | Bajo |
| 8 | Añadir `onKeyDown` handlers | 1h | Alto |

---

## VALORACIÓN FINAL

### ¿Listo para pruebas con niños?

**NO** - Requiere fixes críticos antes de exponer a usuarios reales.

### Criterio Bloqueante
Los errores de TypeScript en `SpainMap.tsx` y `WorldMap.tsx` causarán crashes cuando los niños interactúen con el mapa en Misión Mapamundi. Además, `useLaboratorioFlipStore.ts` tiene un bug que puede causar `null` exceptions.

### Tiempo Estimado para Producción
- **Fixes críticos**: 4-6 horas
- **Fixes altos**: 4-8 horas
- **Tests básicos**: 8-12 horas

### Recomendación
1. Resolver TypeScript errors (PRIORIDAD 1)
2. Ejecutar `npm audit fix --force` (PRIORIDAD 2)
3. Añadir aria-labels a botones (PRIORIDAD 3)
4. Luego: pruebas con niños en entorno controlado

---

## ANÁLISIS DETALLADO POR ARCHIVO

### TypeScript Errors Detectados

```
src/app/page.test.tsx(2,32): error TS2307: Cannot find module '@testing-library/react'
src/app/page.test.tsx(5,1): error TS2582: Cannot find name 'describe'
src/app/world/desafio-steam/BlocklyGame.client.tsx(88,30): error TS2345: Argument type mismatch
src/app/world/desafio-steam/BlocklyGame.client.tsx(142,44): error TS2345: Argument type mismatch
src/app/world/desafio-steam/BlocklyGame.client.tsx(173,38): error TS2345: Argument type mismatch
src/app/world/desafio-steam/RobotBoard 2.tsx(22,15): error TS2339: Property 'position' does not exist
src/app/world/desafio-steam/page.tsx(7,23): error TS2614: No exported member 'BlocklyGameRef'
src/app/world/laboratorio-flip/VideoCard.tsx(180,17): error TS2322: Type mismatch
src/app/world/laboratorio-flip/useLaboratorioFlipStore.ts(215,7): error TS2322: Type mismatch
src/app/world/laboratorio-flip/useLaboratorioFlipStore.ts(221,20): error TS18047: 'count' is possibly null
src/app/world/mision-mapamundi-v2/SpainMap.tsx(56,39): error TS2538: Type 'undefined' cannot be used as index
src/app/world/mision-mapamundi-v2/SpainMap.tsx(68,39): error TS2538: Type 'undefined' cannot be used as index
src/app/world/mision-mapamundi-v2/SpainMap.tsx(149,54): error TS2345: Argument type mismatch
src/app/world/mision-mapamundi-v2/WorldMap.tsx(128,39): error TS2538: Type 'undefined' cannot be used as index
src/app/world/mision-mapamundi-v2/WorldMap.tsx(141,37): error TS2538: Type 'undefined' cannot be used as index
src/app/world/mision-mapamundi-v2/WorldMap.tsx(164,39): error TS2538: Type 'undefined' cannot be used as index
src/app/world/mision-mapamundi-v2/WorldMap.tsx(174,37): error TS2538: Type 'undefined' cannot be used as index
src/app/world/mision-mapamundi-v2/WorldMap.tsx(261,47): error TS18048: 'geo.properties' is possibly undefined
src/app/world/mision-mapamundi-v2/[mode]/page.tsx(23,19): error TS2322: Type 'string' is not assignable
```

### Vulnerabilidades npm

```
@eslint/plugin-kit < 0.3.4 - ReDoS vulnerability
ajv < 6.14.0 - ReDoS with $data option
brace-expansion < 2.0.3 - Memory exhaustion
d3-color < 3.1.0 - ReDoS vulnerability (HIGH)
flatted <= 3.4.1 - Prototype Pollution (HIGH)
react-simple-maps 2.0.0 - 3.0.0 - Depends on vulnerable d3 packages
```

Total: 17 vulnerabilities (1 low, 4 moderate, 12 high)

---

## CONTENIDO EDUCATIVO

### Calidad del Contenido

| Juego | Datos | Calidad | Adecuación |
|-------|-------|---------|-------------|
| Puerto Palabras | 91 palabras | ✅ Excelente | 8-9 años |
| Bosc Lectura | 6 pasajes | ⚠️ Limitado | 8-9 años |
| Mercado Números | 134 tareas | ✅ Bueno | 8-9 años |
| Misión Mapamundi | 27 tareas | ✅ Excelente | 8-9 años |
| STEAM | 6 niveles | ✅ Excelente | 8-9 años |
| Laboratorio Flip | 16 lecciones | ✅ Excelente | 8-9 años |

### Idiomas

| Juego | Español | Catalán | Inglés |
|-------|---------|---------|--------|
| Puerto Palabras | ✅ | ❌ | ❌ |
| Bosc Lectura | ❌ | ✅ | ❌ |
| Mercado Números | ✅ | ❌ | ❌ |
| Misión Mapamundi | ✅ | ❌ | ❌ |
| STEAM | ✅ | ❌ | ❌ |
| Laboratorio Flip | ✅ | ❌ | ❌ |

---

**Fin del informe**