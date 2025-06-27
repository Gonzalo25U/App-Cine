document.addEventListener("DOMContentLoaded", async () => {
  const { data: peliculas, error } = await window.supabase
    .from("vista_catalogo")
    .select("*");

  if (error) {
    console.error("Error al cargar el catálogo:", error);
    return;
  }

  mostrarPeliculas(peliculas);
  mostrarRegistrosRecientes(peliculas);
  inicializarFiltros(peliculas);
  inicializarBusqueda(peliculas);

  // Botón para mostrar todas las películas (reiniciar filtros)
  const btnMostrarTodo = document.getElementById("btnMostrarTodo");
  if (btnMostrarTodo) {
    btnMostrarTodo.addEventListener("click", () => {
      mostrarPeliculas(peliculas);
    });
  }
});

// Mostrar películas
function mostrarPeliculas(peliculas) {
  const contenedor = document.getElementById("catalogo");
  contenedor.innerHTML = "";

  peliculas.forEach((peli) => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow";

    card.innerHTML = `
      <h3 class="text-xl font-bold text-red-600 mb-1">${peli.titulo}</h3>
      <p class="text-gray-800 mb-1">${peli.descripcion}</p>
      <p class="text-sm text-gray-600">🎬 Género: ${peli.genero}</p>
      <p class="text-sm text-gray-600">📅 Año: ${peli.anio_estreno}</p>
      <p class="text-sm text-gray-500 italic">📂 Clasificación: ${peli.clasificacion}</p>
    `;

    contenedor.appendChild(card);
  });
}

// Mostrar últimas películas agregadas
function mostrarRegistrosRecientes(peliculas) {
  const lista = document.getElementById("listaRegistros");
  if (!lista) return;

  lista.innerHTML = "";

  const recientes = [...peliculas].slice(-5).reverse();

  recientes.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="font-medium">${p.titulo}</span>`;
    lista.appendChild(li);
  });
}

// Filtros dinámicos
function inicializarFiltros(peliculas) {
  const generos = [...new Set(peliculas.map(p => p.genero))];
  const anios = [...new Set(peliculas.map(p => p.anio_estreno))].sort((a, b) => b - a);
  const clasificaciones = [...new Set(peliculas.map(p => p.clasificacion))];

  generarDropdown("filtroGenero", generos, (genero) => {
    mostrarPeliculas(peliculas.filter(p => p.genero === genero));
  });

  generarDropdown("filtroAnio", anios, (anio) => {
    mostrarPeliculas(peliculas.filter(p => p.anio_estreno === anio));
  });

  generarDropdown("filtroClasificacion", clasificaciones, (clasif) => {
    mostrarPeliculas(peliculas.filter(p => p.clasificacion === clasif));
  });
}

// Crear dropdown dinámico
function generarDropdown(contenedorId, opciones, callback) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = "";

  const select = document.createElement("select");
select.className = "w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded focus:outline-none";


  const defaultOption = document.createElement("option");
  defaultOption.text = `-- Seleccionar --`;
  defaultOption.value = "";
  select.appendChild(defaultOption);

  opciones.forEach((opcion) => {
    const option = document.createElement("option");
    option.value = opcion;
    option.text = opcion;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    if (select.value) callback(select.value);
  });

  contenedor.appendChild(select);
}

// Búsqueda por texto
function inicializarBusqueda(peliculas) {
  const input = document.getElementById("barraBusqueda");
  if (!input) return;

  input.addEventListener("input", () => {
    const texto = input.value.toLowerCase();
    const filtradas = peliculas.filter(p =>
      p.titulo.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
    mostrarPeliculas(filtradas);
  });
}
