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

## Incidencias conocidas

- Actualmente, las Islas Canarias no son visibles ni seleccionables en el modo CCAA del Mapamundi v2, incluso tras ajustar el zoom y el centro del mapa. Se requiere una solución específica para que sean accesibles para el usuario. 