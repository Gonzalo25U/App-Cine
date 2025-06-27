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

  cargarUsuarios();
});

async function cargarUsuarios() {
  const { data: usuarios, error } = await window.supabase
    .from("perfiles")
    .select("id, email, rol")
    .neq("rol", "admin"); // solo usuarios no administradores

  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  if (error || !usuarios) {
    tabla.innerHTML = `<tr><td colspan="3" class="text-center p-4 text-red-500">Error al cargar usuarios</td></tr>`;
    console.error("Error:", error);
    return;
  }

  if (usuarios.length === 0) {
    tabla.innerHTML = `<tr><td colspan="3" class="text-center p-4 text-gray-400">No hay usuarios registrados</td></tr>`;
    return;
  }

  usuarios.forEach((usuario) => {
    const row = document.createElement("tr");
    row.className = "border-t border-gray-700";
    row.innerHTML = `
      <td class="py-2 px-4">${usuario.email}</td>
      <td class="py-2 px-4">${usuario.rol}</td>
      <td class="py-2 px-4">
        <button onclick="asignarRol('${usuario.id}')" class="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded mr-2">
          Asignar Rol
        </button>
        <button onclick="eliminarUsuario('${usuario.id}')" class="bg-red-600 hover:bg-red-700 px-2 py-1 rounded">
          Eliminar
        </button>
      </td>
    `;
    tabla.appendChild(row);
  });
}

async function asignarRol(usuarioId) {
  const nuevoRol = prompt("Ingrese el nuevo rol (admin o user):", "user");

  if (!nuevoRol || (nuevoRol !== "admin" && nuevoRol !== "user")) {
    alert("Rol no válido.");
    return;
  }

  const { error } = await window.supabase
    .from("perfiles")
    .update({ rol: nuevoRol })
    .eq("id", usuarioId);

  if (error) {
    alert("Error al actualizar el rol.");
    console.error(error);
    return;
  }

  cargarUsuarios();
}

async function eliminarUsuario(usuarioId) {
  const confirmacion = confirm("¿Deseas eliminar este usuario?");
  if (!confirmacion) return;

  const { error } = await window.supabase
    .from("perfiles")
    .delete()
    .eq("id", usuarioId);

  if (error) {
    alert("Error al eliminar el usuario.");
    console.error(error);
    return;
  }

  cargarUsuarios();
}
