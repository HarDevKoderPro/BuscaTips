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
  const textoLower = textoBusqueda.toLowerCase();
  return tipsData.filter((tip) =>
    tip.nombre.toLowerCase().includes(textoLower),
  );
}

export function renderizarTabla(tips) {
  const tbody = document.getElementById("resultados-body");
  tbody.innerHTML = "";
  if (tips.length === 0) return;

  tips.forEach((tip) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.textContent = tip.nombre;
    a.href = "#";
    a.dataset.url = tip.url;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Tip seleccionado:", tip.nombre);
    });

    td.appendChild(a);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

// Recibe un array de nuevos tips y los combina con los existentes para descargar
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
