// FrontEnd/js/api.js
const API_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function apiFetch(path, opts = {}) {
  const headers = opts.headers || {};
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_URL + path, { ...opts, headers });
  if (!res.ok) {
    // Try to forward server message
    let text;
    try { text = await res.json(); } catch(e){ text = { message: res.statusText }; }
    throw text;
  }
  // Si no hay contenido
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.blob();
}
