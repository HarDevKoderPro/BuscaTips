// ========================================
// LIBRERIA.JS - Funciones Reutilizables
// ========================================

let tipsData = [];

export async function cargarTips() {
  try {
    const response = await fetch("./tips.json");
    if (!response.ok) throw new Error("No se pudo cargar tips.json");
    tipsData = await response.json();
    return tipsData;
  } catch (error) {
    console.error("Error al cargar tips:", error);
    return [];
  }
}

export function filtrarTips(textoBusqueda) {
  if (!textoBusqueda.trim()) return [];
  const texto = textoBusqueda.toLowerCase().trim();

  if (texto.includes(" ")) {
    const palabras = texto.split(/\s+/);
    return tipsData.filter((tip) => {
      const nombreLower = tip.nombre.toLowerCase();
      return palabras.every((palabra) => {
        const regex = new RegExp(`\\b${palabra}`, "i");
        return regex.test(nombreLower);
      });
    });
  } else {
    return tipsData.filter((tip) => {
      const nombreLower = tip.nombre.toLowerCase();
      const regex = new RegExp(`\\b${texto}`, "i");
      return regex.test(nombreLower);
    });
  }
}

function resaltarCoincidencias(texto, textoBusqueda) {
  if (!textoBusqueda.trim()) return texto;
  const busqueda = textoBusqueda.toLowerCase().trim();

  if (busqueda.includes(" ")) {
    const palabras = busqueda.split(/\s+/);
    let resultado = texto;
    palabras.forEach((palabra) => {
      const regex = new RegExp(`(\\b${palabra}\\w*)`, "gi");
      resultado = resultado.replace(regex, "<mark>$1</mark>");
    });
    return resultado;
  } else {
    const regex = new RegExp(`(\\b${busqueda}\\w*)`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  }
}

// Nueva función para obtener y mostrar el Markdown
async function mostrarContenido(url) {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = '<p style="color: #5f7e97;">Cargando contenido...</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener el archivo de Dropbox");

    const markdownText = await response.text();

    // Convertir Markdown a HTML usando la librería marked
    // marked.parse() es el método de la librería que inyectamos en el HTML
    contenedor.innerHTML = marked.parse(markdownText);
  } catch (error) {
    console.error("Error:", error);
    contenedor.innerHTML =
      '<p style="color: #ef5350;">Error al cargar el contenido. Verifica la URL de Dropbox.</p>';
  }
}

export function renderizarTabla(tips, textoBusqueda = "") {
  const tbody = document.getElementById("resultados-body");
  tbody.innerHTML = "";
  if (tips.length === 0) return;

  tips.forEach((tip) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");

    const nombreResaltado = resaltarCoincidencias(tip.nombre, textoBusqueda);
    a.innerHTML = nombreResaltado;
    a.href = "#";

    a.addEventListener("click", (e) => {
      e.preventDefault();
      // Llamamos a la función de renderizado
      mostrarContenido(tip.url);
    });

    td.appendChild(a);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

export function descargarJSON(nuevosTipsArray) {
  const tipsActualizados = [...tipsData, ...nuevosTipsArray];
  const jsonString = JSON.stringify(tipsActualizados, null, 2);
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
