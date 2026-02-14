import {
  cargarTips,
  filtrarTips,
  renderizarTabla,
  descargarJSON,
} from "./libreria.js";

let tipsNuevosAcumulados = [];

// Detección simple de modo mobile
const esMobile = () => window.matchMedia("(max-width: 768px)").matches;

document.addEventListener("DOMContentLoaded", async () => {
  await cargarTips();
  configurarBuscador();

  // El formulario de agregar y el editor sólo se configuran en desktop
  if (!esMobile()) {
    configurarFormularioAgregar();
    configurarModoEditor();
  }

  configurarToggleResultadosMobile();
});

/* ===========================
   BUSCADOR
   =========================== */
function configurarBuscador() {
  const inputBuscador = document.getElementById("buscador");
  const panelContenido = document.getElementById("contenido");

  inputBuscador.addEventListener("input", (e) => {
    const texto = e.target.value;
    if (!texto.trim()) {
      panelContenido.innerHTML = "";
    }
    const resultados = filtrarTips(texto);
    renderizarTabla(resultados, texto);
  });
}

/* ===========================
   TOGGLE RESULTADOS (MOBILE)
   =========================== */
function configurarToggleResultadosMobile() {
  const btnToggle = document.getElementById("btn-toggle-resultados");
  const contResultados = document.getElementById("resultados-container");

  if (!btnToggle || !contResultados) return;

  // Estado inicial: resultados visibles (coincide con captura)
  btnToggle.classList.remove("collapsed");
  contResultados.classList.remove("collapsed");

  btnToggle.addEventListener("click", () => {
    const colapsado = contResultados.classList.toggle("collapsed");
    btnToggle.classList.toggle("collapsed", colapsado);
  });
}

/* ===========================
   MODO EDITOR (DESKTOP)
   =========================== */
function configurarModoEditor() {
  const btnCrear = document.getElementById("btn-crear-tip");
  const panelContenido = document.getElementById("contenido");
  const inputBuscador = document.getElementById("buscador");

  if (!btnCrear) return; // en mobile no existe

  btnCrear.addEventListener("click", () => {
    inputBuscador.value = "";
    renderizarTabla([]);

    panelContenido.innerHTML = `
      <div class="editor-container">
        <div class="editor-header">
          <label style="color: #5f7e97; font-size: 0.8rem;">Título del archivo (sin .md):</label>
          <input type="text" id="editor-title" class="editor-title-input" placeholder="Nombre del tip...">
        </div>
        <div id="editor-workspace" style="flex: 1; display: flex; flex-direction: column;">
          <textarea id="editor-text" class="editor-textarea" placeholder="Escribe tu contenido en Markdown aquí..."></textarea>
          <div id="editor-preview" class="editor-preview-area hidden"></div>
        </div>
        <div class="editor-actions">
          <button id="btn-cancelar-edicion" class="btn-cancel-edit">Cancelar</button>
          <button id="btn-toggle-preview" class="btn-preview">Vista Previa</button>
          <button id="btn-guardar-md" class="btn-save">Guardar .md</button>
        </div>
      </div>
    `;

    const textarea = document.getElementById("editor-text");
    const previewArea = document.getElementById("editor-preview");
    const btnPreview = document.getElementById("btn-toggle-preview");

    btnPreview.addEventListener("click", () => {
      const isPreview = !previewArea.classList.contains("hidden");
      if (isPreview) {
        previewArea.classList.add("hidden");
        textarea.classList.remove("hidden");
        btnPreview.textContent = "Vista Previa";
      } else {
        previewArea.innerHTML = marked.parse(textarea.value);
        textarea.classList.add("hidden");
        previewArea.classList.remove("hidden");
        btnPreview.textContent = "Editar";
      }
    });

    document
      .getElementById("btn-cancelar-edicion")
      .addEventListener("click", () => (panelContenido.innerHTML = ""));

    document.getElementById("btn-guardar-md").addEventListener("click", () => {
      const titulo = document.getElementById("editor-title").value.trim();
      if (!titulo || !textarea.value) {
        alert("Completa título y contenido");
        return;
      }
      descargarArchivoMD(titulo, textarea.value);
      panelContenido.innerHTML =
        '<p style="color: #addb67;">¡Archivo descargado!</p>';
      setTimeout(() => (panelContenido.innerHTML = ""), 3000);
    });
  });
}

function descargarArchivoMD(nombre, contenido) {
  const blob = new Blob([contenido], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombre}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ===========================
   FORMULARIO AGREGAR (DESKTOP)
   =========================== */
function configurarFormularioAgregar() {
  const btnDesplegar = document.getElementById("btn-desplegar-agregar");
  const formContainer = document.getElementById("form-agregar-container");
  const btnAgregar = document.getElementById("btn-descargar-json");
  const btnCancelar = document.getElementById("btn-cancelar-agregar");

  if (!btnDesplegar || !formContainer) return; // en mobile no existen

  const inputNombre = document.getElementById("nuevo-nombre");
  const inputUrl = document.getElementById("nueva-url");

  const limpiarYCerrar = () => {
    inputNombre.value = "";
    inputUrl.value = "";
    formContainer.classList.add("hidden");
    tipsNuevosAcumulados = [];
  };

  btnDesplegar.addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
    if (!formContainer.classList.contains("hidden")) {
      inputNombre.value = "";
      inputUrl.value = "";
      inputNombre.focus();
    }
    tipsNuevosAcumulados = [];
  });

  btnAgregar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const urlOriginal = inputUrl.value.trim();

    if (!nombre || !urlOriginal) {
      alert("Completa ambos campos");
      return;
    }

    tipsNuevosAcumulados.push({
      nombre,
      url: convertirURLDropbox(urlOriginal),
    });

    if (confirm("¿Deseas agregar otro tip?")) {
      inputNombre.value = "";
      inputUrl.value = "";
      inputNombre.focus();
    } else {
      descargarJSON(tipsNuevosAcumulados);
      limpiarYCerrar();
    }
  });

  btnCancelar.addEventListener("click", limpiarYCerrar);
}

function convertirURLDropbox(url) {
  if (
    !url.includes("dropbox.com") ||
    url.includes("dl.dropboxusercontent.com")
  ) {
    return url;
  }
  return url
    .replace("www.dropbox.com", "dl.dropboxusercontent.com")
    .replace(/&st=[^&]*/, "")
    .replace(/&dl=\d/, "");
}
