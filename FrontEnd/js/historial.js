import { apiFetch } from './api.js';

fetch('partials/navbar.html')
  .then(r => r.text())
  .then(t => document.getElementById('nav-placeholder').innerHTML = t);

async function loadHist() {
  try {
    const res = await apiFetch('/solicitudes');
    document.getElementById('hist-wrap').innerHTML = res.map(s => `
      <div class="card p-2 mb-2">
        <div><b>${s.items?.[0]?.supplyName || 'Insumo'}</b></div>
        <div>Cant: ${s.items?.[0]?.qty || 0} - Estado: ${s.status || s.estado}</div>
        <div class="text-muted">${new Date(s.createdAt || s.fecha || Date.now()).toLocaleString()}</div>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('hist-wrap').innerHTML = '<div class="alert alert-danger">Error cargando historial</div>';
    console.error(err);
  }
}

loadHist();
