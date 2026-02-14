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

// Búsqueda inteligente progresiva
export function filtrarTips(textoBusqueda) {
  if (!textoBusqueda.trim()) return [];

  const texto = textoBusqueda.toLowerCase().trim();

  // Detectar si hay un espacio (búsqueda por palabras completas)
  if (texto.includes(" ")) {
    const palabras = texto.split(/\s+/);
    return tipsData.filter((tip) => {
      const nombreLower = tip.nombre.toLowerCase();
      // Todas las palabras deben estar presentes como palabras completas
      return palabras.every((palabra) => {
        const regex = new RegExp(`\\b${palabra}`, "i");
        return regex.test(nombreLower);
      });
    });
  } else {
    // Búsqueda por palabra completa en cualquier parte (mientras escribes)
    return tipsData.filter((tip) => {
      const nombreLower = tip.nombre.toLowerCase();
      // Buscar como palabra completa o inicio de palabra
      const regex = new RegExp(`\\b${texto}`, "i");
      return regex.test(nombreLower);
    });
  }
}

// Función para resaltar las coincidencias en el texto
function resaltarCoincidencias(texto, textoBusqueda) {
  if (!textoBusqueda.trim()) return texto;

  const busqueda = textoBusqueda.toLowerCase().trim();

  // Si hay espacios, resaltar cada palabra
  if (busqueda.includes(" ")) {
    const palabras = busqueda.split(/\s+/);
    let resultado = texto;

    palabras.forEach((palabra) => {
      const regex = new RegExp(`(\\b${palabra}\\w*)`, "gi");
      resultado = resultado.replace(regex, "<mark>$1</mark>");
    });

    return resultado;
  } else {
    // Resaltar la palabra donde aparezca
    const regex = new RegExp(`(\\b${busqueda}\\w*)`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  }
}

// Renderizar tabla con resaltado
export function renderizarTabla(tips, textoBusqueda = "") {
  const tbody = document.getElementById("resultados-body");
  tbody.innerHTML = "";
  if (tips.length === 0) return;

  tips.forEach((tip) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");

    // Aplicar resaltado al nombre
    const nombreResaltado = resaltarCoincidencias(tip.nombre, textoBusqueda);
    a.innerHTML = nombreResaltado;

    a.href = "#";
    a.dataset.url = tip.url;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Tip seleccionado:", tip.nombre);
      console.log("URL:", tip.url);
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
