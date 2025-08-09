const API_URL = "http://localhost:3000/api";

// Cargar hospitales e insumos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
    await cargarHospitales();
    await cargarInsumos();
    await listarSolicitudes();

    document.getElementById("formSolicitud").addEventListener("submit", crearSolicitud);
});

// Obtener lista de hospitales
async function cargarHospitales() {
    try {
        const res = await fetch(`${API_URL}/hospitales`);
        const hospitales = await res.json();
        const select = document.getElementById("hospital");
        select.innerHTML = '<option value="">Seleccione Hospital</option>';
        hospitales.forEach(h => {
            select.innerHTML += `<option value="${h._id}">${h.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error cargando hospitales:", error);
    }
}

// Obtener lista de insumos
async function cargarInsumos() {
    try {
        const res = await fetch(`${API_URL}/insumos`);
        const insumos = await res.json();
        const select = document.getElementById("insumo");
        select.innerHTML = '<option value="">Seleccione Insumo</option>';
        insumos.forEach(i => {
            select.innerHTML += `<option value="${i._id}">${i.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error cargando insumos:", error);
    }
}

// Listar solicitudes
async function listarSolicitudes() {
    try {
        const res = await fetch(`${API_URL}/solicitudes`);
        const solicitudes = await res.json();
        const tbody = document.getElementById("solicitudesBody");
        tbody.innerHTML = "";

        solicitudes.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.hospital?.nombre || "N/A"}</td>
                    <td>${s.insumo?.nombre || "N/A"}</td>
                    <td>${s.cantidad}</td>
                    <td>${s.prioridad}</td>
                    <td>${s.estado}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="cambiarEstado('${s._id}', 'aprobada')">Aprobar</button>
                        <button class="btn btn-danger btn-sm" onclick="cambiarEstado('${s._id}', 'rechazada')">Rechazar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error listando solicitudes:", error);
    }
}

// Crear solicitud
async function crearSolicitud(e) {
    e.preventDefault();

    const nuevaSolicitud = {
        hospital: document.getElementById("hospital").value,
        insumo: document.getElementById("insumo").value,
        cantidad: document.getElementById("cantidad").value,
        prioridad: document.getElementById("prioridad").value
    };

    try {
        const res = await fetch(`${API_URL}/solicitudes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaSolicitud)
        });

        if (res.ok) {
            alert("Solicitud creada con éxito");
            document.getElementById("formSolicitud").reset();
            listarSolicitudes();
        } else {
            const err = await res.json();
            alert("Error al crear solicitud: " + err.error);
        }
    } catch (error) {
        console.error("Error creando solicitud:", error);
    }
}

// Cambiar estado de solicitud
async function cambiarEstado(id, estado) {
    try {
        const res = await fetch(`${API_URL}/solicitudes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado })
        });

        if (res.ok) {
            listarSolicitudes();
        } else {
            const err = await res.json();
            alert("Error al cambiar estado: " + err.error);
        }
    } catch (error) {
        console.error("Error cambiando estado:", error);
    }
}
