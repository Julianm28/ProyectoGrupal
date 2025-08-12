document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.message || 'Error de inicio de sesión');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);

    if (data.user.role === 'admin') {
      window.location.href = 'admin.html';
    } else if (data.user.role === 'medico') {
      window.location.href = 'medico.html';
    } else if (data.user.role === 'bodega') {
      window.location.href = 'bodega.html';
    }
  } catch (error) {
    alert('Error de conexión');
  }
});
