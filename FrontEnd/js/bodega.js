import { API_URL, getToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarSolicitudes();

  document.getElementById('btnBuscar').addEventListener('click', buscarInsumo);
  document.getElementById('btnExportarPDF').addEventListener('click', () => exportarReporte('pdf'));
  document.getElementById('btnExportarExcel').addEventListener('click', () => exportarReporte('excel'));
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
    const tbody = document.getElementById('tablaResultados');
    tbody.innerHTML = '';

    if (!insumos.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center">No se encontraron insumos</td></tr>';
    } else {
      insumos.forEach(i => {
        tbody.innerHTML += `
          <tr>
            <td>${i.nombre}</td>
            <td>${i.categoria?.nombre || 'Sin categoría'}</td>
            <td>${i.stock ?? 0}</td>
          </tr>
        `;
      });
    }

    new bootstrap.Modal(document.getElementById('modalResultados')).show();
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
    tbody.innerHTML = '';

    if (!solicitudes.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay solicitudes pendientes</td></tr>';
      return;
    }

    solicitudes.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.insumo?.nombre || 'N/A'}</td>
        <td>${s.cantidad}</td>
        <td>${s.solicitanteId?.nombre || s.solicitanteId?.email || 'N/A'}</td>
        <td>
          <button class="btn btn-success btn-sm me-1 btn-aprobar" data-id="${s._id}">Aprobar</button>
          <button class="btn btn-danger btn-sm btn-rechazar" data-id="${s._id}">Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-aprobar').forEach(btn => {
      btn.addEventListener('click', () => aprobarSolicitud(btn.dataset.id));
    });
    tbody.querySelectorAll('.btn-rechazar').forEach(btn => {
      btn.addEventListener('click', () => rechazarSolicitud(btn.dataset.id));
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function aprobarSolicitud(id) {
  if (!confirm('¿Aprobar esta solicitud?')) return;
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
}

async function rechazarSolicitud(id) {
  if (!confirm('¿Rechazar esta solicitud?')) return;
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
}

async function exportarReporte(tipo) {
  const inicio = document.getElementById('fechaInicio').value;
  const fin = document.getElementById('fechaFin').value;
  if (!inicio || !fin) {
    alert('Seleccione un rango de fechas.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/reportes/insumos-mas-solicitados?inicio=${inicio}&fin=${fin}&formato=${tipo}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al generar reporte');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte.${tipo === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
