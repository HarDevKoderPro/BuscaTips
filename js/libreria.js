// ============================================================
// BuscaTips - Librería principal (conexión con API REST)
// ============================================================
// Maneja: carga, búsqueda, CRUD y renderizado de tips
// API Base: /api/tips.php
// ============================================================

// URL base de la API (ajustar si cambia la ubicación)
const API_URL = "api/tips.php";

// Almacén local de tips cargados
let tipsData = [];

// Datos del tip actualmente visualizado (para edición en desktop)
let tipActualId = null;
let contenidoOriginalMD = "";
let nombreTipActual = "";

// Detección de mobile
const esMobile = () => window.matchMedia("(max-width: 768px)").matches;

// ─── FUNCIONES DE API (CRUD) ───────────────────────────────────

/**
 * Cargar todos los tips desde la API
 * GET /api/tips.php
 * @returns {Array} Lista de tips
 */
export async function cargarTips() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    if (json.success && json.data) {
      tipsData = json.data;
      return tipsData;
    }
    console.warn("API respondió sin datos:", json.message);
    return [];
  } catch (error) {
    console.error("Error al cargar tips:", error);
    return [];
  }
}

/**
 * Buscar tips en la API por texto
 * GET /api/tips.php?buscar=texto
 * @param {string} texto - Término de búsqueda
 * @returns {Array} Tips encontrados
 */
export async function buscarTipsAPI(texto) {
  if (!texto.trim()) return [];
  try {
    const response = await fetch(
      `${API_URL}?buscar=${encodeURIComponent(texto.trim())}`
    );
    const json = await response.json();

    if (json.success && json.data) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.error("Error al buscar tips:", error);
    return [];
  }
}

/**
 * Crear un nuevo tip
 * POST /api/tips.php
 * @param {string} nombre - Título del tip
 * @param {string} contenido - Contenido en Markdown
 * @returns {Object|null} Tip creado o null si falló
 */
export async function crearTip(nombre, contenido) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, contenido }),
    });
    const json = await response.json();

    if (json.success && json.data) {
      // Agregar al almacén local
      tipsData.unshift(json.data);
      return json.data;
    }
    alert("Error al crear tip: " + (json.message || "Error desconocido"));
    return null;
  } catch (error) {
    console.error("Error al crear tip:", error);
    alert("Error de conexión al crear el tip.");
    return null;
  }
}

/**
 * Editar un tip existente
 * PUT /api/tips.php?id=X
 * @param {number} id - ID del tip
 * @param {string} nombre - Nuevo título
 * @param {string} contenido - Nuevo contenido en Markdown
 * @returns {Object|null} Tip actualizado o null si falló
 */
export async function editarTip(id, nombre, contenido) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, contenido }),
    });
    const json = await response.json();

    if (json.success && json.data) {
      // Actualizar en el almacén local
      const idx = tipsData.findIndex((t) => t.id == id);
      if (idx !== -1) tipsData[idx] = json.data;
      return json.data;
    }
    alert("Error al editar tip: " + (json.message || "Error desconocido"));
    return null;
  } catch (error) {
    console.error("Error al editar tip:", error);
    alert("Error de conexión al editar el tip.");
    return null;
  }
}

/**
 * Eliminar un tip
 * DELETE /api/tips.php?id=X
 * @param {number} id - ID del tip a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
export async function eliminarTip(id) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    });
    const json = await response.json();

    if (json.success) {
      // Remover del almacén local
      tipsData = tipsData.filter((t) => t.id != id);
      return true;
    }
    alert("Error al eliminar tip: " + (json.message || "Error desconocido"));
    return false;
  } catch (error) {
    console.error("Error al eliminar tip:", error);
    alert("Error de conexión al eliminar el tip.");
    return false;
  }
}

// ─── FUNCIONES DE FILTRADO LOCAL ───────────────────────────────

/**
 * Filtrar tips cargados localmente (búsqueda rápida sin API)
 * Se usa para filtrado instantáneo mientras el usuario escribe
 * @param {string} textoBusqueda
 * @returns {Array} Tips filtrados
 */
export function filtrarTips(textoBusqueda) {
  if (!textoBusqueda.trim()) return [];
  const texto = textoBusqueda.toLowerCase().trim();
  const palabras = texto.split(/\s+/);
  return tipsData.filter((tip) => {
    const nombreLower = tip.nombre.toLowerCase();
    return palabras.every((p) => new RegExp(`\\b${p}`, "i").test(nombreLower));
  });
}

// ─── FUNCIONES DE RENDERIZADO ──────────────────────────────────

/**
 * Resaltar coincidencias de búsqueda en el texto
 */
function resaltarCoincidencias(texto, textoBusqueda) {
  if (!textoBusqueda.trim()) return texto;
  const palabras = textoBusqueda.toLowerCase().trim().split(/\s+/);
  let resultado = texto;
  palabras.forEach((p) => {
    resultado = resultado.replace(
      new RegExp(`(\\b${p}\\w*)`, "gi"),
      "<mark>$1</mark>"
    );
  });
  return resultado;
}

/**
 * Mostrar el contenido de un tip en el panel principal
 * Ahora usa el contenido directamente del objeto tip (campo 'contenido')
 * @param {Object} tip - Objeto tip con id, nombre, contenido
 */
function mostrarContenido(tip) {
  const contenedor = document.getElementById("contenido");

  // Guardamos datos para posible edición (solo desktop)
  tipActualId = tip.id;
  contenidoOriginalMD = tip.contenido;
  nombreTipActual = tip.nombre;

  // Renderizamos el Markdown a HTML
  const htmlContenido = marked.parse(tip.contenido || "");

  // Solo en desktop mostramos botones de editar y eliminar
  if (!esMobile()) {
    contenedor.innerHTML = `
      <div class="view-header desktop-only">
        <button id="btn-eliminar-actual" class="btn-delete-toggle">🗑️ Eliminar</button>
        <button id="btn-editar-actual" class="btn-edit-toggle">✏️ Editar este Tip</button>
      </div>
      <div id="visor-markdown" class="markdown-body">
        ${htmlContenido}
      </div>
    `;

    // Evento para el botón editar
    document
      .getElementById("btn-editar-actual")
      .addEventListener("click", () => {
        const evento = new CustomEvent("activarEdicion", {
          detail: {
            id: tipActualId,
            titulo: nombreTipActual,
            contenido: contenidoOriginalMD,
          },
        });
        document.dispatchEvent(evento);
      });

    // Evento para el botón eliminar
    document
      .getElementById("btn-eliminar-actual")
      .addEventListener("click", () => {
        const evento = new CustomEvent("activarEliminacion", {
          detail: { id: tipActualId, nombre: nombreTipActual },
        });
        document.dispatchEvent(evento);
      });
  } else {
    // En mobile solo mostramos el contenido sin botones de acción
    contenedor.innerHTML = `
      <div id="visor-markdown" class="markdown-body">
        ${htmlContenido}
      </div>
    `;
  }
}

/**
 * Renderizar la tabla de resultados en el sidebar
 * @param {Array} tips - Lista de tips a mostrar
 * @param {string} textoBusqueda - Texto para resaltar coincidencias
 */
export function renderizarTabla(tips, textoBusqueda = "") {
  const tbody = document.getElementById("resultados-body");
  tbody.innerHTML = "";

  tips.forEach((tip) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");

    // Enlace con nombre del tip
    const a = document.createElement("a");
    a.innerHTML = resaltarCoincidencias(tip.nombre, textoBusqueda);
    a.href = "#";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarContenido(tip);
    });
    td.appendChild(a);

    // Botones de acción (solo desktop)
    if (!esMobile()) {
      const acciones = document.createElement("span");
      acciones.className = "tip-acciones desktop-only";

      // Botón editar
      const btnEditar = document.createElement("button");
      btnEditar.className = "btn-accion-tip btn-editar-tip";
      btnEditar.title = "Editar tip";
      btnEditar.textContent = "✏️";
      btnEditar.addEventListener("click", (e) => {
        e.stopPropagation();
        const evento = new CustomEvent("activarEdicion", {
          detail: {
            id: tip.id,
            titulo: tip.nombre,
            contenido: tip.contenido,
          },
        });
        document.dispatchEvent(evento);
      });

      // Botón eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn-accion-tip btn-eliminar-tip";
      btnEliminar.title = "Eliminar tip";
      btnEliminar.textContent = "🗑️";
      btnEliminar.addEventListener("click", (e) => {
        e.stopPropagation();
        const evento = new CustomEvent("activarEliminacion", {
          detail: { id: tip.id, nombre: tip.nombre },
        });
        document.dispatchEvent(evento);
      });

      acciones.appendChild(btnEditar);
      acciones.appendChild(btnEliminar);
      td.appendChild(acciones);
    }

    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}
