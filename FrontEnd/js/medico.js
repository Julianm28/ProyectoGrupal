import { API_URL, apiGet, apiPost } from './api.js';

function verificarSesion() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sesión expirada o inexistente. Por favor inicia sesión.');
        window.location.href = 'login.html';
    }
    return token;
}

async function cargarInsumos() {
    try {
        const data = await apiGet('/insumos/public');
        const datalist = document.getElementById('lista-insumos');
        datalist.innerHTML = '';

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(insumo => {
                const option = document.createElement('option');
                option.value = insumo.nombre;
                datalist.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Error al cargar insumos', err);
        alert('Error al cargar insumos.');
    }
}


async function cargarHospitales() {
    try {
        const data = await apiGet('/hospitals');
        const select = document.getElementById('hospital');
        select.innerHTML = '';

        data.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital._id;
            option.textContent = hospital.nombre;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Error al cargar hospitales', err);
        alert('Error al cargar hospitales.');
    }
}

async function cargarCategorias() {
    try {
        const res = await fetch(`${API_URL}/categorias`); // público, sin token
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();

        const select = document.getElementById('categoria');
        select.innerHTML = '<option value="">-- Selecciona una categoría --</option>';

        if (Array.isArray(data)) {
            data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat._id;
                option.textContent = cat.nombre;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Error al cargar categorías', err);
        alert('Error al cargar categorías.');
    }
}

async function enviarSolicitud(e) {
    e.preventDefault();
    verificarSesion();

    const insumoNombre = document.getElementById('insumo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const cantidad = document.getElementById('cantidad').value;
    const prioridad = document.getElementById('prioridad').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const hospital = document.getElementById('hospital').value;

    if (!insumoNombre || !cantidad || !prioridad || !descripcion || !hospital) {
        alert('Todos los campos son obligatorios');
        return;
    }

    try {
        await apiPost('/solicitudes', {
            insumo: insumoNombre,
            categoria: categoria || undefined, // solo si es nuevo
            cantidad: parseInt(cantidad, 10),
            prioridad,
            descripcion,
            hospital
        });

        alert('Solicitud enviada correctamente');
        document.getElementById('form-solicitud').reset();
        cargarHistorial();
    } catch (err) {
        console.error('Error al enviar solicitud', err);
        alert('Error al enviar solicitud. Revisa los datos.');
    }
}

async function cargarHistorial() {
    try {
        const data = await apiGet('/solicitudes/mias');
        const tbody = document.getElementById('tabla-historial');
        tbody.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay solicitudes registradas</td></tr>';
            return;
        }

        data.forEach(solicitud => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${solicitud.insumo?.nombre || solicitud.insumo || '—'}</td>
                <td>${solicitud.cantidad}</td>
                <td>${solicitud.prioridad}</td>
                <td>${solicitud.estado}</td>
                <td>${new Date(solicitud.createdAt).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error al cargar historial', err);
        alert('Error al cargar historial.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarInsumos();
    cargarHospitales();
    cargarCategorias();
    cargarHistorial();

    const form = document.getElementById('form-solicitud');
    if (form) {
        form.addEventListener('submit', enviarSolicitud);
    }
});
