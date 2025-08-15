import { API_URL, authFetch, logout } from './api.js';

document.getElementById('logoutBtn').addEventListener('click', () => {
  logout();
});

async function cargarAlertas() {
  try {
    const res = await authFetch(`${API_URL}/alertas`);
    const alertas = await res.json();

    const tbody = document.querySelector('#alertasTable tbody');
    tbody.innerHTML = '';

    alertas.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.insumo?.nombre || 'Sin nombre'}</td>
        <td>${a.insumo?.categoria?.nombre || 'Sin categoría'}</td>
        <td>${a.insumo?.stockActual ?? 'N/D'}</td>
        <td>${a.insumo?.stockMinimo ?? 'N/D'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error cargando alertas:', error);
  }
}

cargarAlertas();
