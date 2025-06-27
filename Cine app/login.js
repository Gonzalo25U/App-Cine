// login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: "Completa todos los campos."
      });
      return;
    }

    const { user, session, error } = await window.supabase.auth.signIn({
      email,
      password
    });

    if (error) {
      console.error("Error de login:", error.message);
      Swal.fire({
        icon: "error",
        title: "Inicio de sesión fallido",
        text: error.message
      });
      return;
    }

    // Si todo fue bien:
    Swal.fire({
      icon: "success",
      title: "¡Bienvenido!",
      text: `Sesión iniciada como ${email}`,
      confirmButtonText: "Continuar"
    }).then(() => {
      window.location.href = "bienvenida.html";
    });
  });
});
