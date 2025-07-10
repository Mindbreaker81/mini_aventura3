Aquí tienes un prompt “copiar-pegar” para Cursor que generará todo el minijuego 5: “Desafío STEAM” (introducción a la programación por bloques).
Guárdalo, por ejemplo, como cursor-prompt-steam.md, ejecútalo en Cursor y la IA te creará rutas, componentes, datos y tests listos para compilar.

prompt
Copiar
Editar
### Objetivo del minijuego
Construir **“Desafío STEAM”**, quinto mundo de *ExplorAventura 3*.  
El alumno programa, con bloques estilo Blockly, a un **robot explorador** que debe llegar a su meta evitando obstáculos en un tablero 6×6.  
Los retos introducen secuencias y bucles simples (repeat x veces).  
Cada reto completado enciende un LED del robot; al terminar todos, el jugador gana XP y un badge.

---

### Stack (idéntico al proyecto raíz)
Next.js 14 + TypeScript · Tailwind · Zustand · Supabase · next-i18next · PWA  
Librería de bloques: **blockly** (v11) + `@blockly/react` (render clásico).

---

### Requisitos funcionales
1. **Ruta** `/world/desafio-steam`
   - Header con LEDs encendidos (progreso 0/6) y botón «Salir».
   - **Componente `<BlocklyGame />`** con:
     - Panel Blockly (categorías: “Movimiento”, “Control”).
     - Canvas `<RobotBoard />` (grid 6×6) que muestra robot, obstáculos y meta.
     - Botón “Ejecutar” —deshabilitado si no hay bloques— y “Reiniciar”.
2. **Retos**
   - 6 puzzles por partida, orden fijo, definidos en `steam-tasks.json`.
   - Cada puzzle tiene: disposición de obstáculos, posición inicial/objetivo y número máximo de bloques permitidos (para incentivar bucles).
3. **Progreso / Vidas**
   - 3 reinicios posibles por puzzle (cada fallo quita 1 vida).  
   - Si el robot choca → feedback sonoro + corazón menos; si llega a meta → LED + XP.
4. **Recompensas**
   - +20 XP por puzzle superado.  
   - Bonus +120 XP y badge  
     `{"id":"ingeniero_junior","name":"Ingeniero Junior"}`  
     al completar los 6 retos sin agotar vidas en ninguno.  
   - Persistir con `completeWorld(userId,"desafio-steam",score)` en Supabase.
5. **Persistencia offline**
   - Código Blockly guardado en `localStorage` (`steam-session`) para reanudar.
6. **Accesibilidad**
   - Bloques con labels legibles (`text-lg`); `aria-live="polite"` para mensajes.
7. **i18n**
   - Interfaz multilingüe (es / ca / en) vía `common.json`; enunciados de reto permanecen en castellano.

---

### Archivo de datos
`/app/data/steam-tasks.json`
```json
[
  {
    "id": 1,
    "name": "Calentamiento",
    "maxBlocks": 6,
    "board": {
      "start": [0, 0],
      "goal": [5, 0],
      "walls": []
    },
    "hint": "Solo necesitas bloques de avanzar."
  },
  {
    "id": 2,
    "name": "El desvío",
    "maxBlocks": 10,
    "board": {
      "start": [0, 0],
      "goal": [5, 5],
      "walls": [[2,0],[2,1],[2,2],[2,3]]
    },
    "hint": "Gira antes del muro y usa repetir."
  },
  {
    "id": 3,
    "name": "Serpiente",
    "maxBlocks": 12,
    "board": {
      "start": [0, 5],
      "goal": [5, 0],
      "walls": [[1,1],[1,3],[3,1],[3,3]]
    },
    "hint": "Combina repetir con girar."
  }
  /* … añade 3 puzzles más, total 6 */
]
Estructura de archivos / componentes
swift
Copiar
Editar
/app/world/desafio-steam/page.tsx
/app/world/desafio-steam/BlocklyGame.tsx
/app/world/desafio-steam/RobotBoard.tsx       ← canvas con grid
/app/world/desafio-steam/blocks.ts            ← definición de bloques personalizados
/app/data/steam-tasks.json
/tests/steam.spec.ts                          ← test Playwright
Código clave a generar
blocks.ts

ts
Copiar
Editar
import Blockly from 'blockly/core';
// Bloque avanzar
Blockly.Blocks['move_forward'] = {
  init() { this.appendDummyInput().appendField('avanzar 1'); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(210); }
};
// Generador JavaScript
Blockly.JavaScript['move_forward'] = () => 'move(1);\n';
/* bloques girar_izq, girar_der, repeat */
RobotBoard.tsx

Props: board, robotPos, walls, goal, onStepEnd(crashed:boolean, reached:boolean).

Renderiza grid con Tailwind (grid grid-cols-6 gap-1).

BlocklyGame.tsx

ts
Copiar
Editar
const [lives, setLives] = useState(3);
const [leds, setLeds]  = useState(0);
const runCode = () => {
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  /* eval sandbox: ejecuta move(), turnLeft(), etc. con promesas para animar */
};
useEffect(() => {
  if (leds === 6) completeWorld(...);
}, [leds]);
Supabase helper /lib/supabase/completeWorld.ts.

Playwright test

ts
Copiar
Editar
test('completa Desafío STEAM', async ({ page }) => {
  await page.goto('/world/desafio-steam');
  // construye solución mínima con bloques vía drag-and-drop (mock)…
  await expect(page.getByText('¡Robot iluminado al completo!')).toBeVisible();
});
PWA & rendimiento
getStaticProps precarga steam-tasks.json.

Service Worker: Cache-First para JSON y assets Blockly.

Instrucciones SQL/CLI Supabase
bash
Copiar
Editar
supabase migration new add_steam_to_worlds
# dentro de la migración:
INSERT INTO worlds(id, name) VALUES ('desafio-steam', 'Desafío STEAM');
Estilo de salida requerido
Archivos completos, compilables, sin pseudocódigo.

Comentarios claros en español.

Tailwind para estilos (p. ej. className="bg-orange-200 rounded-2xl p-4 shadow-xl").

¡Genera ahora!