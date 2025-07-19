# 📝 Changelog - ExplorAventura 3

## [2.0.0] - Diciembre 2024

### 🎮 Desafío STEAM - Mejoras de Experiencia del Jugador

#### ✨ Nuevas Características
- **Animaciones de movimiento paso a paso**: El robot se mueve visiblemente de casilla en casilla
- **Timing optimizado**: 1500ms para movimientos, 1200ms para giros (muy lento para visualización clara)
- **Rastro visual del robot**: El camino del robot se muestra con un rastro azul claro en tiempo real
- **Estados visuales del robot**:
  - Normal: 🤖 (emoji según dirección)
  - Ejecutando: 🤖 + pulse + scale-110 + ring azul
  - Crash: 💥 + bounce + celda roja + ring rojo
- **Feedback visual mejorado**:
  - Meta rebota durante la ejecución
  - Indicador "Ejecutando código..." con spinner
  - Mensaje de crash con emoji 💥
  - Rastro del camino visible celda por celda
- **Pausas estratégicas**:
  - 1000ms al chocar para mostrar el error
  - 2000ms adicional antes del feedback
  - 1500ms para celebrar el éxito

#### 🔧 Mejoras Técnicas
- **Comunicación entre componentes**: Cambio de ref-based a callback-based
- **Wrapper para dynamic import**: `BlocklyGame.tsx` para mejor carga de Blockly
- **Estado de crash**: Nuevo estado `hasCrashed` para feedback visual
- **Transiciones CSS**: `transition-all duration-200` para todas las celdas
- **Animaciones Tailwind**: `animate-pulse`, `animate-bounce`, `scale-110`

#### 🐛 Correcciones
- **Botones no funcionales**: Solucionado problema de comunicación entre editor y página
- **Props no pasados**: Arreglado wrapper que no pasaba props correctamente
- **Logs de debug**: Limpiados logs innecesarios para mejor rendimiento
- **Interfaz limpia**: Eliminados botones de debug y force update

#### 📱 Mejoras de UX
- **Interfaz más limpia**: Sin elementos de debug visibles
- **Feedback inmediato**: Estados claros durante la ejecución
- **Mejor accesibilidad**: Indicadores visuales claros del estado del juego
- **Experiencia inmersiva**: Animaciones que hacen el aprendizaje más divertido

### 🏗️ Arquitectura
- **Separación de responsabilidades**: Editor y visualización claramente separados
- **Estado global mejorado**: Nuevos estados para mejor control de la UI
- **Persistencia**: Código guardado automáticamente en localStorage
- **Error handling**: Mejor manejo de errores con feedback visual

### 📊 Impacto en el Aprendizaje
- **Visualización clara**: Los estudiantes pueden ver exactamente qué hace cada comando
- **Feedback inmediato**: Entienden inmediatamente si su código funciona o no
- **Motivación**: Animaciones hacen el aprendizaje más atractivo
- **Comprensión**: Movimiento paso a paso ayuda a entender la lógica de programación

---

## [1.0.0] - Versión Inicial

### 🎮 Juegos Implementados
- Puerto de las Palabras (Gramática)
- Bosc de Lectura (Comprensión lectora)
- Mercado de Números (Matemáticas)
- Misión Mapamundi (Geografía)
- Desafío STEAM (Programación) - Versión básica
- Laboratorio Flip-Ciencia (Ciencias)

### 🏗️ Arquitectura Base
- Next.js 15 con App Router
- React 18 y TypeScript
- Zustand para estado global
- Tailwind CSS para estilos
- Sistema de internacionalización
- Persistencia en localStorage

---

*Este changelog documenta las mejoras significativas del proyecto ExplorAventura 3* 