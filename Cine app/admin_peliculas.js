document.addEventListener('DOMContentLoaded', async () => {
  const { data: peliculas, error } = await window.supabase
    .from("peliculas")
    .select("id, titulo, descripcion, anio_estreno, genero_id, generos!peliculas_genero_id_fkey(nombre)")
    .order("anio_estreno", { ascending: false });

  if (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las películas.' });
    console.error("Error al cargar las películas:", error);
    return;
  }

  mostrarPeliculas(peliculas);
});

function mostrarPeliculas(peliculas) {
  const tabla = document.getElementById("tablaPeliculas");
  tabla.innerHTML = "";

  peliculas.forEach(pelicula => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="py-2 px-4">${pelicula.titulo}</td>
      <td class="py-2 px-4">${pelicula.anio_estreno}</td>
      <td class="py-2 px-4">${pelicula.generos?.nombre || 'Sin género'}</td>
      <td class="py-2 px-4">${pelicula.descripcion}</td>
      <td class="py-2 px-4">
        <button class="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500" onclick="editarPelicula(${pelicula.id})">Editar</button>
        <button class="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 ml-2" onclick="eliminarPelicula(${pelicula.id})">Eliminar</button>
      </td>
    `;

    tabla.appendChild(tr);
  });
}

document.getElementById("btnAgregarPelicula").addEventListener("click", () => {
  document.getElementById("modalPelicula").classList.remove("hidden");
  cargarGeneros();
});

async function cargarGeneros() {
  const { data: generos, error } = await window.supabase.from("generos").select("id, nombre");

  if (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los géneros.' });
    console.error("Error cargando géneros:", error);
    return;
  }

  const selectGenero = document.getElementById("genero");
  selectGenero.innerHTML = `<option value="">Seleccionar género</option>`;

  generos.forEach(genero => {
    const option = document.createElement("option");
    option.value = genero.id;
    option.textContent = genero.nombre;
    selectGenero.appendChild(option);
  });
}

document.getElementById("btnCancelar").addEventListener("click", () => {
  document.getElementById("modalPelicula").classList.add("hidden");
});

document.getElementById("formPelicula").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const anio = document.getElementById("anio").value;
  const genero = document.getElementById("genero").value;
  const descripcion = document.getElementById("descripcion").value;

  if (!titulo || !anio || !genero || !descripcion) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor, completa todos los campos.' });
    return;
  }

  const idPelicula = document.getElementById("idPelicula")?.value;

  if (idPelicula) {
    const { error } = await window.supabase
      .from("peliculas")
      .update({ titulo, anio_estreno: anio, genero_id: genero, descripcion })
      .eq("id", idPelicula);

    if (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la película.' });
      console.error("Error actualizando la película:", error);
    } else {
      Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Película actualizada con éxito.' }).then(() => location.reload());
    }
  } else {
    const { error } = await window.supabase
      .from("peliculas")
      .insert([{ titulo, anio_estreno: anio, genero_id: genero, descripcion }]);

    if (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar la película.' });
      console.error("Error agregando la película:", error);
    } else {
      Swal.fire({ icon: 'success', title: 'Agregado', text: 'Película agregada con éxito.' }).then(() => location.reload());
    }
  }
});

async function editarPelicula(id) {
  const { data: pelicula, error } = await window.supabase
    .from("peliculas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pelicula) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la película seleccionada.' });
    console.error("Error cargando película:", error);
    return;
  }

  await cargarGeneros();

  document.getElementById("titulo").value = pelicula.titulo;
  document.getElementById("anio").value = pelicula.anio_estreno;
  document.getElementById("descripcion").value = pelicula.descripcion;
  document.getElementById("genero").value = pelicula.genero_id;

  document.getElementById("modalPelicula").classList.remove("hidden");

  let inputId = document.getElementById("idPelicula");
  if (!inputId) {
    inputId = document.createElement("input");
    inputId.type = "hidden";
    inputId.id = "idPelicula";
    document.getElementById("formPelicula").appendChild(inputId);
  }
  inputId.value = pelicula.id;

  Swal.fire({
    icon: "info",
    title: "Editando película",
    text: `Estás editando: \"${pelicula.titulo}\"`,
    timer: 2000,
    showConfirmButton: false,
  });
}

async function eliminarPelicula(id) {
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la película de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

  const { error } = await window.supabase
    .from("peliculas")
    .delete()
    .eq("id", id);

  if (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la película.' });
    console.error("Error eliminando la película:", error);
  } else {
    Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Película eliminada correctamente.' }).then(() => location.reload());
  }
}
