// URL base del backend
const API_URL = "http://localhost:3000/api";

// Función para mostrar alertas Bootstrap
function mostrarAlerta(mensaje, tipo = "success", tiempo = 3000) {
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alerta.style.zIndex = "9999";
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, tiempo);
}

// Función genérica para manejar errores de fetch
async function manejarErrorFetch(res) {
    let mensaje = "Error en la solicitud";
    try {
        const data = await res.json();
        if (data.mensaje) mensaje = data.mensaje;
        if (data.error) mensaje += `: ${data.error}`;
    } catch {
        // Ignorar si no se puede leer JSON
    }
    mostrarAlerta(mensaje, "danger");
}

// Función para confirmar acciones
function confirmarAccion(mensaje, callback) {
    if (confirm(mensaje)) {
        callback();
    }
}

// Función para formatear fechas
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-CR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Cargar opciones en un select desde API
async function cargarOpcionesSelect(endpoint, selectId, textoInicial = "Seleccione...") {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`);
        const datos = await res.json();
        const select = document.getElementById(selectId);
        select.innerHTML = `<option value="">${textoInicial}</option>`;
        datos.forEach(item => {
            select.innerHTML += `<option value="${item._id}">${item.nombre}</option>`;
        });
    } catch (error) {
        console.error(`Error cargando ${endpoint}:`, error);
    }
}
