// api.js
export const API_URL = 'http://localhost:3000/api';

// Función para obtener el token del almacenamiento local
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Hace un GET a la API con autenticación por token
 * @param {string} endpoint - Ruta de la API (ej: '/insumos/public')
 */
export async function apiGet(endpoint) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
    }

    return res.json();
}

/**
 * Hace un POST a la API con autenticación por token
 * @param {string} endpoint - Ruta de la API
 * @param {object} data - Datos a enviar
 */
export async function apiPost(endpoint, data) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
    }

    return res.json();
}
