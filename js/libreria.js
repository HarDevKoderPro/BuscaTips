let tipsData = [];
// Variables para rastrear el tip que se está visualizando actualmente
let contenidoOriginalMD = "";
let nombreTipActual = "";

export async function cargarTips() {
  try {
    const response = await fetch("./tips.json");
    tipsData = await response.json();
    return tipsData;
  } catch (error) {
    return [];
  }
}

export function filtrarTips(textoBusqueda) {
  if (!textoBusqueda.trim()) return [];
  const texto = textoBusqueda.toLowerCase().trim();
  const palabras = texto.split(/\s+/);
  return tipsData.filter((tip) => {
    const nombreLower = tip.nombre.toLowerCase();
    return palabras.every((p) => new RegExp(`\\b${p}`, "i").test(nombreLower));
  });
}

function resaltarCoincidencias(texto, textoBusqueda) {
  if (!textoBusqueda.trim()) return texto;
  const palabras = textoBusqueda.toLowerCase().trim().split(/\s+/);
  let resultado = texto;
  palabras.forEach((p) => {
    resultado = resultado.replace(
      new RegExp(`(\\b${p}\\w*)`, "gi"),
      "<mark>$1</mark>",
    );
  });
  return resultado;
}

// Detección de mobile
const esMobile = () => window.matchMedia("(max-width: 768px)").matches;

async function mostrarContenido(url, nombre) {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = "<p>Cargando...</p>";
  try {
    const response = await fetch(url);
    const markdownText = await response.text();

    // Guardamos datos para posible edición (solo desktop)
    contenidoOriginalMD = markdownText;
    nombreTipActual = nombre;

    // Renderizamos el contenido
    const htmlContenido = marked.parse(markdownText);

    // Solo en desktop mostramos el botón de editar
    if (!esMobile()) {
      contenedor.innerHTML = `
        <div class="view-header desktop-only">
          <button id="btn-editar-actual" class="btn-edit-toggle">✏️ Editar este Tip</button>
        </div>
        <div id="visor-markdown" class="markdown-body">
          ${htmlContenido}
        </div>
      `;

      // Evento para el botón editar (solo desktop)
      document
        .getElementById("btn-editar-actual")
        .addEventListener("click", () => {
          // Disparamos un evento personalizado que script.js escuchará
          const evento = new CustomEvent("activarEdicion", {
            detail: { titulo: nombreTipActual, contenido: contenidoOriginalMD },
          });
          document.dispatchEvent(evento);
        });
    } else {
      // En mobile solo mostramos el contenido sin botón de editar
      contenedor.innerHTML = `
        <div id="visor-markdown" class="markdown-body">
          ${htmlContenido}
        </div>
      `;
    }
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar.</p>";
  }
}

export function renderizarTabla(tips, textoBusqueda = "") {
  const tbody = document.getElementById("resultados-body");
  tbody.innerHTML = "";
  tips.forEach((tip) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.innerHTML = resaltarCoincidencias(tip.nombre, textoBusqueda);
    a.href = "#";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarContenido(tip.url, tip.nombre);
    });
    td.appendChild(a);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

export function descargarJSON(nuevosTipsArray) {
  const jsonString = JSON.stringify([...tipsData, ...nuevosTipsArray], null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tips.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
