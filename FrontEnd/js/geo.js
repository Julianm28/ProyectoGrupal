(async function () {
  const map = L.map('map').setView([9.7489, -83.7534], 7); // Centro CR
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map);

  const res = await fetch('/api/mapa/hospitales');
  const hospitales = await res.json();

  hospitales.forEach(h => {
    const m = L.marker([h.lat, h.lng]).addTo(map);
    m.bindPopup(`<strong>${h.nombre}</strong><br>${h.tipo || ''}<br>${h.direccion || ''}<br>${h.telefono || ''}`);
  });
})();