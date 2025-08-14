// FrontEnd/js/login.js
(function () {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value || "";

    if (!email || !password) {
      alert("Complete email y contraseña");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // Si no es 2xx, mostrar error legible
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = errData?.msg || `Error de autenticación (${res.status})`;
        alert(msg);
        return;
      }

      const data = await res.json();
      if (data?.token) {
        // guardar token y role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user?.role || "");

        const role = data.user?.role;
        if (role === "admin") {
          window.location.href = "/admin.html";
        } else if (role === "medico") {
          window.location.href = "/medico.html";
        } else if (role === "bodega") {
          window.location.href = "/bodega.html";
        } else {
          // fallback
          window.location.href = "/admin.html";
        }
      } else {
        alert("Respuesta inválida del servidor");
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      alert("No se pudo conectar con el servidor");
    }
  });
})();
