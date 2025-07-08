const fs = require('fs');
const path = require('path');

// Ruta al archivo GeoJSON original
const geojsonPath = path.join(__dirname, 'public', 'oceans.geojson');
const outputPath = path.join(__dirname, 'public', 'oceans_filtered.geojson');

// Lista de nombres y códigos de océanos principales
const mainOceans = [
  { name: "Atlantic Ocean", OCEAN_ID: "ATL" },
  { name: "Pacific Ocean", OCEAN_ID: "PAC" },
  { name: "Indian Ocean", OCEAN_ID: "IND" },
  { name: "Arctic Ocean", OCEAN_ID: "ARC" },
  { name: "Southern Ocean", OCEAN_ID: "ANT" }
];

const oceanNames = mainOceans.map(o => o.name.toLowerCase());

const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

// Filtrar solo features de los océanos principales
const filteredFeatures = geojson.features.filter(f => {
  const props = f.properties || {};
  if (!props.name) return false;
  return oceanNames.includes(props.name.toLowerCase());
});

// Asignar OCEAN_ID y normalizar name
filteredFeatures.forEach(f => {
  const found = mainOceans.find(o => o.name.toLowerCase() === f.properties.name.toLowerCase());
  if (found) {
    f.properties.name = found.name;
    f.properties.OCEAN_ID = found.OCEAN_ID;
  }
});

const filteredGeojson = {
  ...geojson,
  features: filteredFeatures
};

fs.writeFileSync(outputPath, JSON.stringify(filteredGeojson, null, 2));
console.log(`Archivo filtrado guardado en ${outputPath}`); 