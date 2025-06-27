document.addEventListener("DOMContentLoaded", async () => {
  const user = window.supabase.auth.user();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const { data: perfil, error: perfilError } = await window.supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (perfilError || perfil.rol !== "admin") {
    window.location.href = "bienvenida.html";
    return;
  }

  cargarEstadisticas();
});

async function cargarEstadisticas() {
  const { data, error } = await window.supabase
    .from("peliculas_por_genero")
    .select("*");

  if (error) {
    console.error("Error al obtener estadísticas:", error);
    return;
  }

  const labels = data.map((item) => item.genero);
  const cantidades = data.map((item) => item.cantidad);

  const ctx = document.getElementById("graficoGenero").getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Películas por Género",
        data: cantidades,
        backgroundColor: [
          "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6"
        ],
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#1F2937',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Distribución de Películas por Género',
          color: '#111827',
          font: {
            size: 18
          }
        }
      }
    }
  });
}
