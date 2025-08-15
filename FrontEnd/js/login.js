import { API_URL } from './api.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error('Credenciales inválidas');

    const data = await res.json();

    // Validar que haya token y usuario
    if (!data.token || !data.user) {
      throw new Error('Respuesta inválida del servidor');
    }

    // Guardar token y rol para usar en las llamadas API
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log("Usuario autenticado:", data.user);

    // Redirigir según el rol
    switch (data.user.role) {
      case 'admin':
        window.location.href = 'admin.html';
        break;
      case 'medico':
        window.location.href = 'medico.html';
        break;
      case 'bodega':
        window.location.href = 'bodega.html';
        break;
      default:
        alert('Rol no reconocido');
        break;
    }

  } catch (err) {
    console.error('Login fetch error:', err);
    alert(err.message);
  }
});
