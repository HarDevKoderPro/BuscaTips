// ========================================
// SCRIPT.JS - Lógica Principal
// ========================================

import {
  cargarTips,
  filtrarTips,
  renderizarTabla,
  descargarJSON,
} from "./libreria.js";

let tipsNuevosAcumulados = [];

document.addEventListener("DOMContentLoaded", async () => {
  await cargarTips();
  configurarBuscador();
  configurarFormularioAgregar();
});

function configurarBuscador() {
  const inputBuscador = document.getElementById("buscador");
  const panelContenido = document.getElementById("contenido"); // Referencia al panel derecho

  inputBuscador.addEventListener("input", (e) => {
    const texto = e.target.value;

    // Si el buscador está vacío, limpiamos también el panel de contenido
    if (!texto.trim()) {
      panelContenido.innerHTML = "";
    }

    const resultados = filtrarTips(texto);
    renderizarTabla(resultados, texto);
  });
}

function configurarFormularioAgregar() {
  const btnDesplegar = document.getElementById("btn-desplegar-agregar");
  const formContainer = document.getElementById("form-agregar-container");
  const btnCancelar = document.getElementById("btn-cancelar-agregar");
  const btnAgregar = document.getElementById("btn-descargar-json");
  const inputNombre = document.getElementById("nuevo-nombre");
  const inputUrl = document.getElementById("nueva-url");
  const inputBuscador = document.getElementById("buscador");
  const panelContenido = document.getElementById("contenido");

  btnDesplegar.addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
    tipsNuevosAcumulados = [];
  });

  btnCancelar.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    limpiarFormulario();
    tipsNuevosAcumulados = [];
  });

  btnAgregar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const urlOriginal = inputUrl.value.trim();

    if (!nombre || !urlOriginal) {
      alert("Por favor completa ambos campos");
      return;
    }

    const urlConvertida = convertirURLDropbox(urlOriginal);

    tipsNuevosAcumulados.push({
      nombre,
      url: urlConvertida,
    });

    const deseaOtro = confirm("¿Deseas agregar otro tip a la lista?");

    if (deseaOtro) {
      limpiarFormulario();
      inputNombre.focus();
    } else {
      descargarJSON(tipsNuevosAcumulados);

      limpiarFormulario();
      formContainer.classList.add("hidden");
      tipsNuevosAcumulados = [];

      inputBuscador.value = "";
      renderizarTabla([]);
      panelContenido.innerHTML = ""; // Limpiar contenido al finalizar carga masiva
    }
  });
}

function limpiarFormulario() {
  document.getElementById("nuevo-nombre").value = "";
  document.getElementById("nueva-url").value = "";
}

function convertirURLDropbox(url) {
  if (!url.includes("dropbox.com")) {
    return url;
  }

  if (url.includes("dl.dropboxusercontent.com")) {
    return url;
  }

  let urlConvertida = url.replace(
    "www.dropbox.com",
    "dl.dropboxusercontent.com",
  );
  urlConvertida = urlConvertida.replace(/&st=[^&]*/, "");
  urlConvertida = urlConvertida.replace(/&dl=\d/, "");

  return urlConvertida;
}
