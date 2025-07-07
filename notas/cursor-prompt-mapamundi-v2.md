### Objetivo del minijuego
Desarrollar **“Misión Mapamundi” – v2**, sexto mundo de *ExplorAventura 3*.  
El alumno elige primero qué quiere practicar:

1. **Continentes**  
2. **Océanos**  
3. **Comunidades autónomas de España (CCAA)**  

Durante una partida **solo se lanzan preguntas del modo elegido**.  
Cada acierto estampa un sello en su pasaporte; al reunir todos los sellos, el jugador gana XP y un badge.

---

### Stack (idéntico al proyecto raíz)
Next 14 + TypeScript · Tailwind · Zustand · Supabase · next-i18next · PWA.  
Mapas con **react-simple-maps** + TopoJSON  
  • `world-110m.json` → continentes y océanos  
  • `spain-ccaa.json` → 17 CCAA  

---

### Flujo de usuario
1. **Pantalla selector** (`/world/mision-mapamundi`)  
   - Componente `<ModeSelector />` con tres tarjetas (Continentes, Océanos, CCAA).  
   - Al elegir un modo se redirige a `/world/mision-mapamundi/[mode]` (`mode ∈ "continent" | "ocean" | "ccaa"`).  

2. **Pantalla juego** (`/world/mision-mapamundi/[mode]`)  
   - Header con progreso (sellos 0 / N) y botón «Salir a selector».  
   - `<MapGame />` carga:  
     - **Mapa mundial** para `continent` u `ocean`.  
     - **Mapa España** para `ccaa`.  
   - Pregunta visible «Haz clic en…».  
   - 5 corazones (vidas). Cada fallo resta uno y muestra tooltip explicativo.  

---

### Configuración por modo
| Modo | Nº preguntas por partida (N) | Fuentes de datos | Badge |
|------|------------------------------|------------------|-------|
| `continent` | 7 continentes | `type:"CONTINENT"` | `{ id:"globetrotter_cont",  name:"Explorador de Continentes" }` |
| `ocean`     | 5 océanos     | `type:"OCEAN"`     | `{ id:"globetrotter_ocean", name:"Explorador de Océanos" }` |
| `ccaa`      | 10 CCAA       | `type:"CCAA"`      | `{ id:"globetrotter_ccaa",  name:"Explorador de España" }` |

Cada acierto ⇒ **+12 XP**.  
Al completar las N preguntas con ≥1 corazón ⇒ **+100 XP** adicionales y se concede el badge del modo.  

---

### Persistencia
- Estado de la partida (`currentTask`, vidas, sellos) guardado en **`localStorage`** con clave `mapamundi-<mode>-session`.  
- Al ganar, llamar a `completeWorld(userId,"mision-mapamundi-"+mode,score)` en Supabase.

---

### Accesibilidad
- Navegación por teclado (← ↑ ↓ → para cambiar región resaltada; Enter para seleccionar).  
- `aria-live="polite"` para feedback.  

---

### i18n
Interfaz multilingüe (`es / ca / en`) vía `common.json`; las preguntas siguen en castellano.

---

### Archivos / componentes
/app/world/mision-mapamundi/page.tsx ← ModeSelector/app/world/mision-mapamundi/[mode]/page.tsx ← juego/app/world/mision-mapamundi/MapGame.tsx/app/world/mision-mapamundi/WorldMap.tsx/app/world/mision-mapamundi/SpainMap.tsx/app/world/mision-mapamundi/Passport.tsx ← 5-10 sellos dinámicos/app/data/mapamundi-tasks.json/tests/mapamundi-[mode].spec.ts ← 3 tests Playwright (uno por modo)
---

### Datos
`/app/data/mapamundi-tasks.json`
```json
[
  /* CONTINENTS (7) */
  { "id": 1,  "mode": "continent", "question": "Haz clic en África",        "targetId": "AF",  "explanation": "África se sitúa debajo de Europa." },
  { "id": 2,  "mode": "continent", "question": "Señala Oceanía",            "targetId": "OC",  "explanation": "Oceanía está al sureste de Asia." },
  /* ... 5 continentes más ... */

  /* OCEANS (5) */
  { "id": 101,"mode": "ocean",     "question": "Localiza el Océano Índico.", "targetId": "IND", "explanation": "Entre África, Asia y Oceanía." },
  { "id": 102,"mode": "ocean",     "question": "¿Dónde está el Atlántico?",  "targetId": "ATL", "explanation": "Entre América y Europa-África." },
  /* ... 3 océanos más ... */

  /* CCAA (17) */
  { "id": 201,"mode": "ccaa",      "question": "Haz clic en Andalucía.",     "targetId": "AN",  "explanation": "Andalucía está al sur de la península." },
  { "id": 202,"mode": "ccaa",      "question": "Localiza Cataluña.",         "targetId": "CT",  "explanation": "En la esquina noreste de España." }
  /* ... 15 CCAA restantes ... */
]

Código clave a generar
	1	ModeSelector.tsxconst modes = [
	2	  { id: 'continent', label: 'Continentes',   icon: GlobeIcon },
	3	  { id: 'ocean',     label: 'Océanos',       icon: WavesIcon },
	4	  { id: 'ccaa',      label: 'CCAA España',   icon: MapPinIcon }
	5	];
	6	// Tarjetas Tailwind que hacen router.push(`/world/mision-mapamundi/${id}`)
	7	
	8	MapGame.tsxconst { mode } = useParams();          // "continent" | "ocean" | "ccaa"
	9	const tasks = useMemo(() =>
	10	    shuffle(data.filter(t => t.mode === mode)).slice(0, maxPerMode[mode]),
	11	  [mode]);
	12	// lógica de vidas, sellos y XP como antes
	13	
	14	Passport.tsx
	◦	Dibuja 7, 5 o 10 sellos según maxPerMode[mode].

PWA & rendimiento
	•	getStaticProps precarga mapamundi-tasks.json y TopoJSON mundial / España.
	•	Service Worker: Cache-First para JSON y mapas.

Instrucciones Supabase
supabase migration new add_mapamundi_modes
/* en la migración: */
INSERT INTO worlds(id,name) VALUES
  ('mision-mapamundi-continent','Misión Mapamundi – Continentes'),
  ('mision-mapamundi-ocean',    'Misión Mapamundi – Océanos'),
  ('mision-mapamundi-ccaa',     'Misión Mapamundi – CCAA');

Estilo de salida requerido
	•	Archivos completos, listos para compilar; nada de pseudocódigo.
	•	Comentarios claros en español.
	•	Tailwind (ej. className="bg-indigo-200 rounded-2xl p-4 shadow-xl").
¡Genera ahora!