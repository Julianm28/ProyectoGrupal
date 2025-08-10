// URL base del backend
const API_URL = "http://localhost:3000/api";

// Mostrar alertas Bootstrap
function mostrarAlerta(mensaje, tipo = "success", tiempo = 3000) {
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alerta.style.zIndex = "9999";
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), tiempo);
}

// Manejar errores de fetch
async function manejarErrorFetch(res) {
    let mensaje = "Error en la solicitud";
    try {
        const data = await res.json();
        if (data.mensaje) mensaje = data.mensaje;
        if (data.error) mensaje += `: ${data.error}`;
    } catch { }
    mostrarAlerta(mensaje, "danger");
}

// Confirmar acción
function confirmarAccion(mensaje, callback) {
    if (confirm(mensaje)) callback();
}

// Formatear fecha
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

// Cargar opciones de un select desde API
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

// =====================
// Funciones para Solicitudes
// =====================

// Listar solicitudes
async function listarSolicitudes() {
    try {
        const res = await fetch(`${API_URL}/solicitudes`);
        const solicitudes = await res.json();
        const tbody = document.getElementById("tablaSolicitudes");
        tbody.innerHTML = "";
        if (solicitudes.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6'>No hay solicitudes registradas</td></tr>";
            return;
        }
        solicitudes.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.hospital?.nombre || "N/A"}</td>
                    <td>${s.insumo?.nombre || "N/A"}</td>
                    <td>${s.cantidad}</td>
                    <td>${s.prioridad}</td>
                    <td>${formatearFecha(s.createdAt)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarSolicitud('${s._id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        manejarErrorFetch(error);
    }
}

// Crear solicitud
async function crearSolicitud(datos) {
    try {
        const res = await fetch(`${API_URL}/solicitudes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        if (!res.ok) return manejarErrorFetch(res);
        mostrarAlerta("Solicitud creada con éxito");
        listarSolicitudes();
    } catch (error) {
        manejarErrorFetch(error);
    }
}

// Eliminar solicitud
async function eliminarSolicitud(id) {
    confirmarAccion("¿Desea eliminar esta solicitud?", async () => {
        try {
            const res = await fetch(`${API_URL}/solicitudes/${id}`, { method: "DELETE" });
            if (!res.ok) return manejarErrorFetch(res);
            mostrarAlerta("Solicitud eliminada correctamente");
            listarSolicitudes();
        } catch (error) {
            manejarErrorFetch(error);
        }
    });
}

// =====================
// Inicialización automática según página
// =====================
document.addEventListener("DOMContentLoaded", () => {
    // Si estamos en solicitudes.html
    if (document.getElementById("formSolicitud")) {
        cargarOpcionesSelect("hospitales", "hospital", "Seleccione un hospital");
        cargarOpcionesSelect("insumos", "insumo", "Seleccione un insumo");
        listarSolicitudes();

        document.getElementById("formSolicitud").addEventListener("submit", (e) => {
            e.preventDefault();
            const datos = {
                hospital: document.getElementById("hospital").value,
                insumo: document.getElementById("insumo").value,
                cantidad: parseInt(document.getElementById("cantidad").value),
                prioridad: document.getElementById("prioridad").value
            };
            crearSolicitud(datos);
            e.target.reset();
        });
    }
});
