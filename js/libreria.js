// ========================================
// LIBRERIA.JS - Funciones Reutilizables
// ========================================

let tipsData = []; // Array global para almacenar los tips cargados

// Función para cargar los tips desde el JSON
export async function cargarTips() {
  try {
    const response = await fetch("./tips.json");
    if (!response.ok) throw new Error("No se pudo cargar tips.json");
    tipsData = await response.json();
    console.log("Tips cargados:", tipsData);
    return tipsData;
  } catch (error) {
    console.error("Error al cargar tips:", error);
    return [];
  }
}

// Función para filtrar tips según el texto de búsqueda
export function filtrarTips(textoBusqueda) {
  if (!textoBusqueda.trim()) return []; // Si está vacío, no devuelve nada

  const textoLower = textoBusqueda.toLowerCase();
  return tipsData.filter((tip) =>
    tip.nombre.toLowerCase().includes(textoLower),
  );
}

// Función para renderizar la tabla de resultados
export function renderizarTabla(tips) {
  const tbody = document.getElementById("resultados-body");

  // Limpiar tabla
  tbody.innerHTML = "";

  // Si no hay tips, dejar vacío
  if (tips.length === 0) return;

  // Crear filas
  tips.forEach((tip) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");

    a.textContent = tip.nombre;
    a.href = "#";
    a.dataset.url = tip.url; // Guardamos la URL en un data attribute

    // Evento click (por ahora solo console.log)
    a.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Tip seleccionado:", tip.nombre);
      console.log("URL:", tip.url);
      // Aquí irá la lógica de renderizado de Markdown en el siguiente paso
    });

    td.appendChild(a);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

// Función para obtener los tips actuales (útil para descargar JSON)
export function obtenerTips() {
  return tipsData;
}

// Función para generar y descargar el JSON actualizado
export function descargarJSON(nuevoTip) {
  // Crear nuevo array con el tip agregado
  const tipsActualizados = [...tipsData, nuevoTip];

  // Convertir a JSON con formato legible
  const jsonString = JSON.stringify(tipsActualizados, null, 2);

  // Crear blob y descargar
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tips.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("JSON descargado con éxito");
}
