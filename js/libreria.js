let tipsData = [];

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

async function mostrarContenido(url) {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = "<p>Cargando...</p>";
  try {
    const response = await fetch(url);
    const markdownText = await response.text();
    contenedor.innerHTML = marked.parse(markdownText);
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
      mostrarContenido(tip.url);
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
