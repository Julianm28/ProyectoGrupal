// medico.js
import { apiGet, apiPost } from './api.js';

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
        const select = document.getElementById('insumo');
        select.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No hay insumos disponibles';
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        data.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo._id; // ID real que espera el backend
            option.textContent = `${insumo.nombre} - Stock: ${insumo.cantidad}`;
            select.appendChild(option);
        });
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
            option.value = hospital._id; // IMPORTANTE: enviamos el ID
            option.textContent = hospital.nombre;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Error al cargar hospitales', err);
        alert('Error al cargar hospitales.');
    }
}


async function enviarSolicitud(e) {
    e.preventDefault();
    verificarSesion();

    const insumo = document.getElementById('insumo').value;
    const cantidad = document.getElementById('cantidad').value;
    const prioridad = document.getElementById('prioridad').value;
    const descripcion = document.getElementById('descripcion').value;
    const hospital = document.getElementById('hospital').value; // ahora es un ObjectId

    if (!insumo || !cantidad || !prioridad || !descripcion || !hospital) {
        alert('Todos los campos son obligatorios');
        return;
    }

    try {
        await apiPost('/solicitudes', {
            insumo, // puede ser ID o nombre
            cantidad: parseInt(cantidad, 10),
            prioridad,
            descripcion,
            hospital // es un ID válido
        });

        alert('Solicitud enviada correctamente');
        document.getElementById('form-solicitud').reset();
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
                <td>${solicitud.insumo?.nombre || '—'}</td>
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
    cargarHistorial();

    const form = document.getElementById('form-solicitud');
    if (form) {
        form.addEventListener('submit', enviarSolicitud);
    }
});
