document.addEventListener("DOMContentLoaded", cargarHospitales);

document.getElementById("formHospital").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    codigo: document.getElementById("codigo").value,
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    tipo: document.getElementById("tipo").value
  };

  const res = await fetch(`${API_URL}/hospitales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("✅ Hospital agregado");
    cargarHospitales();
  } else {
    const err = await res.json();
    mostrarError(err.error || "Error al agregar hospital");
  }
});

async function cargarHospitales() {
  const res = await fetch(`${API_URL}/hospitales`);
  const hospitales = await res.json();
  const tbody = document.getElementById("hospitalesBody");
  tbody.innerHTML = "";
  hospitales.forEach(h => {
    tbody.innerHTML += `
      <tr>
        <td>${h.codigo}</td>
        <td>${h.nombre}</td>
        <td>${h.direccion}</td>
        <td>${h.tipo}</td>
      </tr>
    `;
  });
}
