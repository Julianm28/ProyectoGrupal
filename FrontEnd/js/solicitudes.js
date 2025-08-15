// /FrontEnd/js/solicitudes.js
import { API_URL, getAuthToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarHistorial();
  document.getElementById('formSolicitud').addEventListener('submit', crearSolicitud);
});

async function crearSolicitud(e) {
  e.preventDefault();

  const insumo = document.getElementById('insumo').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const prioridad = document.getElementById('prioridad').value;
  const descripcion = document.getElementById('descripcion').value;
  const hospital = document.getElementById('hospital').value;

  if (!insumo || !cantidad || !prioridad || !hospital) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ insumo, cantidad, prioridad, descripcion, hospital })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al crear solicitud');
    }

    alert('Solicitud creada con éxito');
    document.getElementById('formSolicitud').reset();
    cargarHistorial();
  } catch (err) {
    alert(err.message);
  }
}

async function cargarHistorial() {
  try {
    const res = await fetch(`${API_URL}/solicitudes/mias`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    const data = await res.json();

    const tbody = document.getElementById('historialSolicitudes');
    tbody.innerHTML = '';

    data.forEach(sol => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${sol.insumo?.nombre || 'N/A'}</td>
        <td>${sol.cantidad}</td>
        <td>${sol.prioridad}</td>
        <td>${sol.estado}</td>
        <td>${new Date(sol.createdAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}
