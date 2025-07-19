# 🤖 Desafío STEAM - Documentación Técnica

## 📋 Resumen del Juego

El **Desafío STEAM** es un juego educativo de programación visual que enseña pensamiento computacional a través de bloques visuales. Los jugadores programan un robot para navegar por un tablero 6x6, evitando obstáculos y llegando a la meta.

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos
```
desafio-steam/
├── page.tsx                    # Página principal del juego
├── BlocklyGame.tsx            # Wrapper para dynamic import
├── BlocklyGame.client.tsx     # Editor de bloques principal
├── RobotBoard.tsx             # Tablero visual del robot
├── useSteamStore.ts           # Estado global del juego
├── blocks.ts                  # Definición de bloques personalizados
├── blockly-utils.ts           # Utilidades de Blockly
└── types.ts                   # Tipos TypeScript
```

### Flujo de Datos
```
useSteamStore (Estado Global)
    ↓
page.tsx (Interfaz Principal)
    ↓
BlocklyGame.client.tsx (Editor)
    ↓
RobotBoard.tsx (Visualización)
```

## 🎮 Experiencia del Jugador

### 1. Pantalla de Instrucciones
- **Objetivo claro**: "Programa el robot para llegar a la meta"
- **Tutorial visual**: Explicación de bloques y mecánicas
- **Expectativas**: Máximo bloques por nivel y sistema de vidas

### 2. Editor de Bloques
- **Interfaz intuitiva**: Drag & drop de bloques
- **Bloques disponibles**:
  - `avanzar()` - Movimiento hacia adelante
  - `girarIzquierda()` - Rotación 90° izquierda
  - `girarDerecha()` - Rotación 90° derecha
  - `repetir(n, acciones)` - Bucle de repetición
- **Validación en tiempo real**: Contador de bloques y límites

### 3. Ejecución Animada
- **Movimiento paso a paso**: 800ms por movimiento, celda por celda
- **Giros animados**: 600ms por rotación
- **Rastro visual**: El camino del robot se muestra con un rastro azul claro
- **Feedback visual inmediato**:
  - Robot pulsa durante ejecución
  - Meta rebota para llamar atención
  - Indicador "Ejecutando código..."
  - Rastro del camino visible en tiempo real

### 4. Estados de Feedback
- **Ejecutando**: Spinner + texto azul
- **Crash**: 💥 + celda roja + mensaje de error
- **Éxito**: Pausa + mensaje de felicitación
- **Error**: Pausa + mensaje de fallo

## 🔧 Implementación Técnica

### Estado Global (useSteamStore.ts)

```typescript
interface SteamState {
  tasks: SteamTask[];
  currentTask: number;
  robot: RobotState;
  lives: number;
  xp: number;
  isExecuting: boolean;
  hasCrashed: boolean;
  blocklyCode: string;
  showInstructions: boolean;
  gameCompleted: boolean;
  feedback: FeedbackState | null;
  badge: BadgeState | null;
}
```

### API de Ejecución

```typescript
const api = {
  move: async (steps: number = 1) => {
    // Validación de límites y obstáculos
    // Actualización de posición del robot
    // Animación de 300ms
  },
  turnLeft: async () => {
    // Rotación del robot
    // Animación de 200ms
  },
  turnRight: async () => {
    // Rotación del robot
    // Animación de 200ms
  }
};
```

### Comunicación entre Componentes

```typescript
// page.tsx → BlocklyGame.client.tsx
<BlocklyGame onReady={handleBlocklyReady} />

// BlocklyGame.client.tsx → page.tsx
onReady({
  runCode,
  handleReset,
  getBlockCount,
  isLoaded: () => effectiveBlocklyLoaded
});
```

## 🎨 Sistema de Animaciones

### CSS Transitions
```css
/* Transiciones suaves para todas las celdas */
transition-all duration-200

/* Animaciones específicas */
.animate-pulse    /* Robot durante ejecución */
.animate-bounce   /* Meta durante ejecución */
.animate-spin     /* Spinner de carga */
.scale-110        /* Robot escalado */
```

### Estados Visuales del Robot
1. **Normal**: 🤖 (emoji según dirección)
2. **Ejecutando**: 🤖 + pulse + scale-110 + ring azul
3. **Crash**: 💥 + bounce + celda roja + ring rojo

### Timing de Animaciones
- **Movimiento**: 1500ms (antes 800ms) - Movimiento muy lento y claramente visible
- **Giro**: 1200ms (antes 600ms) - Giro muy lento para mejor comprensión
- **Pausa al crash**: 1000ms (antes 500ms) - Más tiempo para ver el error
- **Pausa adicional**: 2000ms (antes 1000ms) - Pausa más larga antes del feedback
- **Pausa de éxito**: 1500ms (antes 500ms) - Más tiempo para celebrar

## 🎯 Niveles de Dificultad

### Nivel 1: Movimiento Básico
- **Objetivo**: Llegar a la meta en línea recta
- **Máximo bloques**: 3
- **Conceptos**: Movimiento hacia adelante

### Nivel 2: Giros y Obstáculos
- **Objetivo**: Navegar alrededor de obstáculos
- **Máximo bloques**: 4
- **Conceptos**: Giros y planificación de ruta

### Nivel 3: Bucles Simples
- **Objetivo**: Usar repetición para optimizar
- **Máximo bloques**: 5
- **Conceptos**: Bucles y eficiencia

### Nivel 4: Patrones Complejos
- **Objetivo**: Combinar movimientos y giros
- **Máximo bloques**: 6
- **Conceptos**: Patrones y secuencias

### Nivel 5: Optimización Avanzada
- **Objetivo**: Mínimo número de bloques
- **Máximo bloques**: 7
- **Conceptos**: Optimización y eficiencia

### Nivel 6: Desafío Final
- **Objetivo**: Complejidad máxima
- **Máximo bloques**: 8
- **Conceptos**: Todos los conceptos anteriores

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Botones no funcionan**
   - Verificar que `blocklyFunctions` no sea null
   - Comprobar comunicación entre componentes
   - Revisar logs de consola

2. **Animaciones no se ven**
   - Verificar que `isExecuting` esté en true
   - Comprobar clases CSS de Tailwind
   - Revisar timing de animaciones

3. **Robot no se mueve**
   - Verificar código generado por Blockly
   - Comprobar validación de límites
   - Revisar estado del robot en store

### Debug y Logs

```typescript
// Logs importantes para debug
console.log('[Page] blocklyFunctions:', !!blocklyFunctions);
console.log('[BlocklyGame] onReady existe:', !!onReady);
console.log('[Robot] Posición:', robot.x, robot.y);
console.log('[Execution] Estado:', isExecuting, hasCrashed);
```

## 🚀 Mejoras Futuras

### Posibles Extensiones
1. **Más bloques**: Condicionales, funciones, variables
2. **Niveles adicionales**: Mecánicas más complejas
3. **Modo colaborativo**: Programación en equipo
4. **Exportar código**: Ver código JavaScript generado
5. **Modo libre**: Crear propios niveles

### Optimizaciones Técnicas
1. **Lazy loading**: Cargar Blockly solo cuando sea necesario
2. **Memoización**: Optimizar re-renders de componentes
3. **Web Workers**: Ejecución en background
4. **Service Workers**: Caché offline

## 📊 Métricas y Analytics

### Datos a Rastrear
- Tiempo por nivel
- Número de intentos
- Bloques utilizados vs. óptimo
- Tasa de éxito por nivel
- Tiempo de aprendizaje

### KPIs del Juego
- **Engagement**: Tiempo promedio de sesión
- **Retención**: Jugadores que completan todos los niveles
- **Aprendizaje**: Mejora en eficiencia de código
- **Satisfacción**: Feedback de usuarios

---

*Documentación actualizada: Diciembre 2024*
*Versión del juego: 2.0 con animaciones mejoradas* 