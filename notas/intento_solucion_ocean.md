Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Read file: aventura-multimateria/public/oceans_filtered.geojson
Ran tool
Read file: aventura-multimateria/src/app/world/mision-mapamundi-v2/WorldMap.tsx
Read file: aventura-multimateria/src/app/world/mision-mapamundi-v2/WorldMap.tsx
Tu archivo `oceans_filtered.geojson` **sí contiene varias features** (cada una corresponde a un océano principal), así que el problema no está en el archivo GeoJSON.

En el código de `WorldMap.tsx`, el renderizado de los océanos se hace correctamente usando el componente `<Geographies geography={geography}>`, que recorre todas las features y las pinta individualmente. El click también se maneja por feature.

**¿Por qué entonces solo puedes seleccionar "todo el océano como uno solo"?**
Esto ocurre porque los polígonos de los océanos principales (por ejemplo, el Pacífico) son tan grandes que cubren la mayor parte del mapa, y se superponen con los demás océanos. Así, aunque hay 5 features, visualmente parece que solo hay una, porque el área de cada océano es inmensa y se solapan.

**¿Cómo puedes comprobarlo?**
- Si haces zoom y clic en diferentes partes del mapa, deberías poder seleccionar diferentes océanos (por ejemplo, el Atlántico cerca de Europa/África, el Índico cerca de la India, etc.).
- Pero, si haces clic en el Pacífico, que es el más grande, probablemente cubre casi todo el mapa y "tapa" a los demás.

**¿Cómo se soluciona esto?**
- Si quieres que cada océano sea seleccionable solo en su área, necesitas que los polígonos de los océanos no se solapen tanto, o bien, mostrar solo una parte de cada océano (por ejemplo, usando puntos centrales o áreas simplificadas).
- Otra opción es usar "centroides" o "puntos representativos" para cada océano, y que el usuario haga clic en esos puntos, no en el polígono completo.

**Resumen:**  
El código y el geojson están bien, pero el problema es visual: los océanos son tan grandes que se pisan unos a otros. Por eso parece que solo puedes seleccionar uno, pero en realidad hay 5 features.

¿Quieres que te ayude a:
- Mostrar solo los centroides/puntos de cada océano para que el usuario haga clic?
- O a simplificar los polígonos para que no se solapen tanto?
- O prefieres otra solución visual?

¡Dime cómo prefieres que se seleccione el océano y te ayudo a implementarlo!