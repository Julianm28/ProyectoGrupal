// FrontEnd/js/create-user.js
(function () {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("msg");
  if (!form) return;

  function setMsg(text, ok = false) {
    if (!msg) return;
    msg.innerHTML = `<div class="alert ${ok ? 'alert-success' : 'alert-danger'}" role="alert">${text}</div>`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value || "";
    const role = document.getElementById("role")?.value || "medico";

    if (!email || !password) {
      setMsg("Email y contraseña son requeridos");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, role })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.msg || `Error (${res.status})`);
        return;
      }

      setMsg("Usuario creado correctamente. Ahora puedes iniciar sesión.", true);
    } catch (err) {
      console.error("Register fetch error:", err);
      setMsg("No se pudo conectar con el servidor");
    }
  });
})();
