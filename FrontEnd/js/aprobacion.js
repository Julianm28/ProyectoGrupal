// /FrontEnd/js/aprobacion.js
import { API_URL, getAuthToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarPendientes();
});

async function cargarPendientes() {
  try {
    const res = await fetch(`${API_URL}/solicitudes/pendientes`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    const data = await res.json();

    const tbody = document.getElementById('tablaPendientes');
    tbody.innerHTML = '';

    data.forEach(sol => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${sol.insumo?.nombre || 'N/A'}</td>
        <td>${sol.cantidad}</td>
        <td>${sol.prioridad}</td>
        <td>${sol.hospital?.nombre || 'N/A'}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="aprobar('${sol._id}')">Aprobar</button>
          <button class="btn btn-danger btn-sm" onclick="rechazar('${sol._id}')">Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

window.aprobar = async function (id) {
  if (!confirm('¿Aprobar esta solicitud?')) return;
  try {
    const res = await fetch(`${API_URL}/solicitudes/${id}/aprobar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!res.ok) throw new Error('Error al aprobar');
    cargarPendientes();
  } catch (err) {
    alert(err.message);
  }
};

window.rechazar = async function (id) {
  if (!confirm('¿Rechazar esta solicitud?')) return;
  try {
    const res = await fetch(`${API_URL}/solicitudes/${id}/rechazar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    if (!res.ok) throw new Error('Error al rechazar');
    cargarPendientes();
  } catch (err) {
    alert(err.message);
  }
};
