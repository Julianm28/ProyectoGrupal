import { API_URL, getToken } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarHospitales();
  cargarCategorias();
  cargarAlertas();

  document.getElementById('form-hospital').addEventListener('submit', async (e) => {
    e.preventDefault();
    await registrarHospital();
  });

  document.getElementById('form-categoria').addEventListener('submit', async (e) => {
    e.preventDefault();
    await registrarCategoria();
  });
});

// --- Hospitales ---
async function registrarHospital() {
  const body = {
    nombre: document.getElementById('nombre').value,
    ubicacion: document.getElementById('ubicacion').value
  };

  try {
    const res = await fetch(`${API_URL}/hospitals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error('Error al registrar hospital');
    alert('Hospital registrado correctamente');
    document.getElementById('form-hospital').reset();
    cargarHospitales();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function cargarHospitales() {
  try {
    const res = await fetch(`${API_URL}/hospitals`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al cargar hospitales');

    const hospitales = await res.json();
    const tbody = document.getElementById('tabla-hospitales');
    tbody.innerHTML = hospitales.map(h => `
      <tr>
        <td>${h.nombre}</td>
        <td>${h.ubicacion}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// --- Categorías ---
async function registrarCategoria() {
  const body = { nombre: document.getElementById('categoria').value };

  try {
    const res = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error('Error al registrar categoría');
    alert('Categoría registrada correctamente');
    document.getElementById('form-categoria').reset();
    cargarCategorias();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function cargarCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al cargar categorías');

    const categorias = await res.json();
    const tbody = document.getElementById('tabla-categorias');
    tbody.innerHTML = categorias.map(c => `
      <tr>
        <td>${c.nombre}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// --- Alertas ---
async function cargarAlertas() {
  try {
    const res = await fetch(`${API_URL}/alertas`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Error al cargar alertas');

    const alertas = await res.json();
    const tbody = document.getElementById('tabla-alertas');
    tbody.innerHTML = alertas.length > 0
      ? alertas.map(a => `
        <tr class="${a.tipo === 'sin_stock' ? 'table-danger' : 'table-warning'}">
          <td>${a.nombre}</td>
          <td>${a.stock}</td>
          <td>${a.stockMinimo ?? '-'}</td>
          <td>${a.tipo === 'sin_stock' ? 'Sin stock' : 'Bajo stock'}</td>
        </tr>
      `).join('')
      : '<tr><td colspan="4" class="text-center">No hay alertas</td></tr>';
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
