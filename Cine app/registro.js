document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nombre || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      return;
    }

    // Crear cuenta en Supabase Auth
    const { user, error: signUpError } = await window.supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Error de registro:", signUpError);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: signUpError.message,
      });
      return;
    }

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "No se pudo obtener el usuario después del registro.",
      });
      return;
    }

    // Insertar perfil en la tabla perfiles
    const { error: perfilError } = await window.supabase
      .from("perfiles")
      .insert([
        {
          id: user.id,
          nombre,
          email,
          rol: "usuario",
          foto_perfil: "pictures/user.png", // Ruta local
          fecha_registro: new Date().toISOString(),
        },
      ]);

    if (perfilError) {
      console.error("❌ Error al insertar perfil:", perfilError);
      Swal.fire({
        icon: "warning",
        title: "Registro parcial",
        text: perfilError.message || "El usuario se registró pero no se guardó el perfil.",
      });
      return;
    }

    // Éxito total
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: `Bienvenido, ${nombre}`,
      confirmButtonText: "Ir al login",
    }).then(() => {
      window.location.href = "index.html";
    });
  });
});
