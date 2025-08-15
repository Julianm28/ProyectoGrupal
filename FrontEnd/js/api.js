export const API_URL = 'http://localhost:3000/api';

// Obtener token de localStorage
export function getToken() {
    return localStorage.getItem('token');
}

// GET protegido (con token)
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

// POST protegido (con token)
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
