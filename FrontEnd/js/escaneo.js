import { API_URL, authFetch, logout } from './api.js';

document.getElementById('logoutBtn').addEventListener('click', () => {
  logout();
});

const form = document.getElementById('createUserForm');
const msgBox = document.getElementById('msgBox');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;

  try {
    const res = await authFetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, role })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al crear usuario');
    }

    msgBox.innerHTML = `<div class="alert alert-success">Usuario creado con éxito ✅</div>`;
    form.reset();
  } catch (err) {
    msgBox.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
});
