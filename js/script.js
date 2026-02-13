// ========================================
// SCRIPT.JS - Lógica Principal
// ========================================

import {
  cargarTips,
  filtrarTips,
  renderizarTabla,
  descargarJSON,
} from "./libreria.js";

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
  const btnDescargar = document.getElementById("btn-descargar-json");
  const inputNombre = document.getElementById("nuevo-nombre");
  const inputUrl = document.getElementById("nueva-url");
  const inputBuscador = document.getElementById("buscador");

  btnDesplegar.addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
  });

  btnCancelar.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    limpiarFormulario();
  });

  btnDescargar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const url = inputUrl.value.trim();

    if (!nombre || !url) {
      alert("Por favor completa ambos campos");
      return;
    }

    const nuevoTip = { nombre, url };

    // 1. Disparar la descarga (Ventana Guardar como)
    descargarJSON(nuevoTip);

    // 2. Limpiar formulario y ocultarlo
    limpiarFormulario();
    formContainer.classList.add("hidden");

    // 3. Resetear buscador y tabla para dejar la app en estado inicial
    inputBuscador.value = "";
    renderizarTabla([]);

    console.log("App reseteada a estado inicial tras agregar tip.");
  });
}

function limpiarFormulario() {
  document.getElementById("nuevo-nombre").value = "";
  document.getElementById("nueva-url").value = "";
}
