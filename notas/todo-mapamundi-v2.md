# To-do List - Mapamundi v2

## **Estado del Proyecto: Misión Mapamundi v2**

### ✅ **Completadas:**
1. **✅ Renombrar el minijuego actual a 'mapamundi v1'** - Completado
   - Carpeta renombrada a `mision-mapamundi-v1`
   - Archivo de datos renombrado a `mapamundi-tasks-v1.json`
   - Dashboard y documentación actualizados

2. **✅ Crear la estructura base de Mapamundi v2** - Completado
   - Carpetas creadas: `/mision-mapamundi-v2/` y `/mision-mapamundi-v2/[mode]/`
   - Archivos base: `page.tsx`, `[mode]/page.tsx`, `types.ts`
   - Datos JSON creados: `mapamundi-tasks.json`

3. **✅ Añadir Mapamundi v1 y v2 al dashboard principal** - Completado
   - Ambos juegos disponibles en el dashboard
   - Rutas diferenciadas y descripciones claras

### ✅ **Completadas:**
4. **✅ Implementar el selector de modo (ModeSelector.tsx)** - Completado
   - Página del selector creada ✅
   - Componente MapGame.tsx creado ✅

### ✅ **Completadas:**
5. **✅ Crear y poblar mapamundi-tasks.json** - Completado
   - Archivo JSON creado ✅
   - Datos organizados por modo ✅

6. **✅ Desarrollar el componente principal del juego (MapGame.tsx)** - Completado
   - Lógica principal implementada ✅
   - Store de Zustand creado ✅
   - Componente Passport creado ✅

### ✅ **Completadas:**
7. **✅ Implementar los mapas interactivos (WorldMap.tsx, SpainMap.tsx)** - Completado
   - WorldMap.tsx para continentes y océanos ✅
   - SpainMap.tsx para comunidades autónomas ✅
   - Integración con react-simple-maps ✅

8. **✅ Corregir mapeo de países y clasificación geográfica** - Completado
   - Rusia reclasificada correctamente como Asia ✅
   - Estados Unidos añadido con variación "United States of America" ✅
   - Añadidas variaciones de nombres de países (Brasil, Czechia, etc.) ✅
   - Eliminadas propiedades duplicadas en el diccionario ✅

9. **✅ Eliminar pistas visuales del juego** - Completado
   - El continente objetivo ya no se muestra en verde ✅
   - Solo se muestran en azul las regiones seleccionadas ✅
   - Leyenda actualizada para reflejar los cambios ✅
   - Juego más desafiante y justo ✅

10. **✅ Corregir sistema de sellos del pasaporte** - Completado
    - Lógica de actualización de sellos corregida ✅
    - Store actualiza correctamente completedStamps ✅
    - Pantalla de victoria se muestra al completar ✅
    - Debugging añadido para verificar funcionamiento ✅

11. **✅ Corregir mapeo de países africanos** - Completado
    - "Dem. Rep. Congo" añadido al mapeo ✅
    - "Central African Rep." añadido al mapeo ✅
    - "S. Sudan" añadido al mapeo ✅
    - Todos los países africanos ahora detectados correctamente ✅

### ⏳ **Pendientes:**
12. **⏳ Persistencia y lógica de guardado en localStorage** - Pendiente
13. **⏳ Integración con Supabase** - Pendiente
14. **⏳ Accesibilidad y soporte multilingüe** - Pendiente
15. **⏳ Optimización PWA y precarga de datos/mapas** - Pendiente
16. **⏳ Crear tests E2E para los tres modos** - Pendiente

### 🧭 **Tareas de Prueba y Diagnóstico:**
17. **🧭 Probar modo océanos** - EN PROCESO
    - El archivo `oceans_filtered.geojson` contiene 5 features (uno por océano principal).
    - El código renderiza cada feature individualmente y permite la selección por feature.
    - **Problema detectado:** Los polígonos de los océanos son tan grandes y se solapan tanto que, visualmente, parece que solo se puede seleccionar un océano (el más grande cubre a los demás).
    - **Diagnóstico:** El problema es visual, no de datos ni de lógica. El click funciona por feature, pero el área de cada océano es inmensa y se pisan unos a otros.
    - **Soluciones propuestas:**
      - Usar centroides o puntos representativos para cada océano y que el usuario haga clic en esos puntos.
      - Simplificar los polígonos para que no se solapen tanto.
      - Otras soluciones visuales a definir según preferencia UX.
    - **Tareas concretas:**
      1. Decidir junto al equipo/cliente la solución visual preferida para la selección de océanos.
      2. Implementar la solución elegida (puntos, simplificación, etc.).
      3. Probar la UX y ajustar si es necesario.
      4. Validar que el pasaporte se actualiza correctamente en modo océanos.
      5. Confirmar que la pantalla de victoria aparece al completar.

18. **🧭 Probar modo CCAA (Comunidades Autónomas)** - Pendiente
    - Verificar que el mapa de España funciona correctamente
    - Comprobar que las CCAA se detectan y seleccionan
    - Validar que el pasaporte se actualiza en modo CCAA
    - Confirmar que la pantalla de victoria aparece al completar
    - Verificar que el componente SpainMap.tsx funciona

### 🔄 **Nuevas Tareas Identificadas:**
19. **🔄 Mejorar feedback visual del juego** - Pendiente
    - Añadir animaciones de acierto/error
    - Mostrar mensajes de feedback más claros
    - Indicadores visuales de progreso

20. **🔄 Optimizar rendimiento del mapa** - Pendiente
    - Lazy loading de datos geográficos
    - Memoización de componentes de mapa
    - Reducir re-renders innecesarios

21. **🔄 Añadir modo de práctica** - Pendiente
    - Modo sin límite de vidas para aprender
    - Pistas opcionales para principiantes
    - Tutorial interactivo

22. **🔄 Implementar estadísticas del jugador** - Pendiente
    - Historial de partidas
    - Porcentaje de aciertos por continente
    - Tiempo promedio por pregunta

23. **🔄 Mejorar UX móvil** - Pendiente
    - Optimizar interacción táctil
    - Ajustar zoom y navegación para móviles
    - Responsive design mejorado

---

## **Detalles de Implementación**

### **Estructura de Archivos:**
```
src/app/world/mision-mapamundi-v2/
├── page.tsx                    # Selector de modo
├── [mode]/page.tsx            # Página dinámica del juego
├── types.ts                   # Tipos TypeScript
├── MapGame.tsx               # ⏳ Componente principal del juego
├── WorldMap.tsx              # ⏳ Mapa mundial para continentes/océanos
├── SpainMap.tsx              # ⏳ Mapa de España para CCAA
├── Passport.tsx              # ⏳ Visualización de sellos
└── useMapamundiV2Store.ts    # ⏳ Store de Zustand
```

### **Configuración por Modo:**
- **continent**: 7 preguntas, badge "Explorador de Continentes"
- **ocean**: 5 preguntas, badge "Explorador de Océanos"  
- **ccaa**: 10 preguntas, badge "Explorador de España"

### **Sistema de XP:**
- Cada acierto: +12 XP
- Completar misión: +100 XP + Badge
- 5 vidas por partida

---

## **Notas de Desarrollo**

### **Última Actualización:**
- Fecha: Diciembre 2024
- Estado: **Mapamundi v2 completamente funcional y optimizado**
  - ✅ Mapeo de países corregido y robusto (incluyendo variaciones africanas)
  - ✅ Clasificación geográfica precisa
  - ✅ Juego sin pistas visuales (más desafiante)
  - ✅ Sistema de sellos del pasaporte funcionando correctamente
  - ✅ Interfaz limpia y responsive
  - ✅ Modo continentes completamente probado y funcional
  - ⏳ Modos océanos y CCAA pendientes de prueba y mejora visual

### **Próximos Pasos:**
1. **Prioridad Alta:**
   - Implementar persistencia en localStorage
   - Añadir feedback visual mejorado (animaciones)
   - Optimizar rendimiento del mapa
   - **Solucionar la selección visual de océanos (puntos, simplificación, etc.)**

2. **Prioridad Media:**
   - Implementar modo de práctica
   - Añadir estadísticas del jugador
   - Mejorar UX móvil

3. **Prioridad Baja:**
   - Integración con Supabase
   - Tests E2E
   - Optimización PWA

### **Referencias:**
- Prompt original: `notas/cursor-prompt-mapamundi-v2.md`
- Juego v1: `/world/mision-mapamundi-v1/`
- Datos: `/app/data/mapamundi-tasks.json` 