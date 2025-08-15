import { apiFetch } from './api.js';

// Cargar navbar
fetch('partials/navbar.html')
  .then(r => r.text())
  .then(t => document.getElementById('nav-placeholder').innerHTML = t);

// Crear mapa centrado en Costa Rica
const map = L.map('map').setView([9.9333, -84.0833], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);

// Obtener hospitales y agregar marcadores
(async function () {
  try {
    const hospitals = await apiFetch('/mapa/hospitales');
    hospitals.forEach(h => {
      if (h.lat && h.lng) {
        L.marker([h.lat, h.lng])
          .addTo(map)
          .bindPopup(`<b>${h.nombre}</b><br>${h.direccion || ''}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
