const fs = require('fs');
const path = require('path');

// Ruta al archivo GeoJSON original (corregida)
const geojsonPath = path.join(__dirname, 'public', 'oceans.geojson');

// Lista de nombres y códigos de océanos (ajusta el orden si es necesario)
const oceanNames = [
  { name: "Atlantic Ocean", OCEAN_ID: "ATL" },
  { name: "Pacific Ocean", OCEAN_ID: "PAC" },
  { name: "Indian Ocean", OCEAN_ID: "IND" },
  { name: "Arctic Ocean", OCEAN_ID: "ARC" },
  { name: "Southern Ocean", OCEAN_ID: "ANT" }
];

const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

geojson.features.forEach((feature, idx) => {
  // Asigna el nombre y código según el orden
  if (oceanNames[idx]) {
    feature.properties.name = oceanNames[idx].name;
    feature.properties.OCEAN_ID = oceanNames[idx].OCEAN_ID;
  } else {
    // Si hay más features de la cuenta, pon un nombre genérico
    feature.properties.name = `Ocean ${idx + 1}`;
    feature.properties.OCEAN_ID = `OCEAN_${idx + 1}`;
  }
});

fs.writeFileSync(geojsonPath, JSON.stringify(geojson, null, 2), 'utf8');
console.log('Archivo oceans.geojson actualizado con nombres y códigos de océanos.');