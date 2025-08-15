import { API_URL, getToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarSolicitudes();

  document.getElementById('btnBuscar').addEventListener('click', buscarInsumo);
});

async function buscarInsumo() {
  const query = document.getElementById('buscar').value.trim();
  if (!query) return alert('Ingrese un nombre o código');

  try {
    const res = await fetch(`${API_URL}/insumos?search=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al buscar insumo');

    const insumos = await res.json();
    console.log('Resultado búsqueda:', insumos);
    alert(`Encontrados ${insumos.length} insumos`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function cargarSolicitudes() {
  try {
    const res = await fetch(`${API_URL}/solicitudes/pendientes`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al cargar solicitudes');

    const solicitudes = await res.json();
    const tbody = document.getElementById('tabla-solicitudes');
    tbody.innerHTML = solicitudes.map(s => `
      <tr>
        <td>${s.insumo?.nombre || 'N/A'}</td>
        <td>${s.cantidad}</td>
        <td>${s.solicitanteId || 'N/A'}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="aprobarSolicitud('${s._id}')">Aprobar</button>
          <button class="btn btn-danger btn-sm" onclick="rechazarSolicitud('${s._id}')">Rechazar</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

window.aprobarSolicitud = async function (id) {
  try {
    const res = await fetch(`${API_URL}/solicitudes/${id}/aprobar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al aprobar solicitud');
    alert('Solicitud aprobada');
    cargarSolicitudes();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

window.rechazarSolicitud = async function (id) {
  try {
    const res = await fetch(`${API_URL}/solicitudes/${id}/rechazar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al rechazar solicitud');
    alert('Solicitud rechazada');
    cargarSolicitudes();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
