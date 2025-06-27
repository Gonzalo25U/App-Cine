document.addEventListener('DOMContentLoaded', async () => {
  const user = window.supabase.auth.user(); // Obtener el usuario actual

  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Obtener nombre y rol del usuario
  const { data, error } = await window.supabase
    .from("perfiles")
    .select("nombre, rol")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    console.error("Error cargando perfil:", error.message);
    return;
  }

  // Mostrar información del usuario
  document.getElementById("nombreUsuario").textContent = data.nombre || "Usuario";
  document.getElementById("rolUsuario").textContent = data.rol || "---";
  document.getElementById("userInfo").classList.remove("hidden");
  document.getElementById("btnEstadisticas").classList.remove("hidden"); // este es el nuevo

  // Rellenar campo de nombre
  document.getElementById("editNameInput").value = data.nombre || "";

  // Mostrar botones de admin si es admin
  if (data.rol === "admin") {
    document.getElementById("adminPanel").classList.remove("hidden");
  }
});

// Cambiar nombre de usuario
async function updateUserName() {
  const user = window.supabase.auth.user();
  const newName = document.getElementById('editNameInput').value.trim();

  if (!newName) {
    alert("El nombre no puede estar vacío.");
    return;
  }

  const { error } = await window.supabase
    .from('perfiles')
    .update({ nombre: newName })
    .eq('id', user.id);

  if (error) {
    alert("Error al actualizar el nombre: " + error.message);
    return;
  }

  // Actualizar el nombre en la interfaz
  document.getElementById('nombreUsuario').textContent = newName;

  alert("Nombre actualizado correctamente.");
}

// Cerrar sesión
async function logout() {
  const { error } = await window.supabase.auth.signOut();
  if (error) {
    alert("Error al cerrar sesión: " + error.message);
    return;
  }
  window.location.href = 'index.html';
}
// Función para cargar y renderizar gráfico de películas por género
async function mostrarEstadisticasGenero() {
  const { data, error } = await window.supabase
    .from("peliculas_por_genero")
    .select("*");

  if (error || !data) {
    console.error("Error al cargar estadísticas:", error);
    return;
  }

  const ctx = document.getElementById("graficoGeneros").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.map((g) => g.genero),
      datasets: [{
        label: "Películas por género",
        data: data.map((g) => g.cantidad),
        backgroundColor: [
          "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"
        ],
        borderColor: "#1f2937",
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#fff",
          },
        },
      },
    },
  });
}

