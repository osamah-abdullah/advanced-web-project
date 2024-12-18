import L from 'leaflet';

let map;

export const initializeMap = () => {
  if (map) {
    map.remove(); // Clean up the existing map instance before re-initializing
  }

  map = L.map('map').setView([31.5, 34.8], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
};


export const updateMapData = (villages) => {
  if (!map) return;
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });
  villages.forEach((village) => {
    L.marker([village.latitude, village.longitude]).addTo(map).bindPopup(`
        <b>${village.name}</b><br>
        Population: ${village.demographics.populationSize}<br>
        Region: ${village.region}
      `);
  });
};
