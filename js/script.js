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
  inputBuscador.addEventListener("input", (e) => {
    const texto = e.target.value;
    const resultados = filtrarTips(texto);
    renderizarTabla(resultados);
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
    const url = inputUrl.value.trim();

    if (!nombre || !url) {
      alert("Por favor completa ambos campos");
      return;
    }

    // 1. Acumular el tip
    tipsNuevosAcumulados.push({ nombre, url });

    // 2. Preguntar si desea agregar otro (Aceptar = Sí / Cancelar = No)
    const deseaOtro = confirm("¿Deseas agregar otro tip a la lista?");

    if (deseaOtro) {
      limpiarFormulario();
      inputNombre.focus();
    } else {
      // 3. Descargar y resetear app sin alertas adicionales
      descargarJSON(tipsNuevosAcumulados);

      limpiarFormulario();
      formContainer.classList.add("hidden");
      tipsNuevosAcumulados = [];

      inputBuscador.value = "";
      renderizarTabla([]);

      console.log("Proceso finalizado y JSON descargado.");
    }
  });
}

function limpiarFormulario() {
  document.getElementById("nuevo-nombre").value = "";
  document.getElementById("nueva-url").value = "";
}
