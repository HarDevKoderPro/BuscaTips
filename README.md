# 🔎 BuscaTips

> Biblioteca personal de tips en **Markdown** con **búsqueda** en sidebar y **visor tipo blog**.  
> Incluye editor para crear tips `.md` y generador de `tips.json` (sin backend).

## 📌 Tabla de contenido
- [🎯 Descripción](#-descripción)
- [✨ Características](#-características)
- [🧱 Tecnologías](#-tecnologías)
- [📁 Estructura del proyecto](#-estructura-del-proyecto)
- [⚙️ Configuración (tips.json)](#️-configuración-tipsjson)
- [🚀 Cómo correrlo en local](#-cómo-correrlo-en-local)
- [🧪 Flujo de uso recomendado](#-flujo-de-uso-recomendado)
- [🧩 Notas sobre URLs de Dropbox](#-notas-sobre-urls-de-dropbox)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🗺️ Roadmap](#️-roadmap)
- [📄 Licencia](#-licencia)

## 🎯 Descripción

**BuscaTips** es una app web estática para consultar tips técnicos (comandos, procedimientos, snippets) escritos en **Markdown**.  
El contenido se obtiene desde URLs públicas (por ejemplo, archivos `.md` alojados en Dropbox), se renderiza en el panel principal y se accede mediante una búsqueda rápida en el sidebar.

### ✅ Qué resuelve
- Centralizar tips dispersos en múltiples notas/archivos
- Buscar rápidamente por palabras clave
- Consultar desde cualquier dispositivo (al estar desplegado en web)
- Mantener un flujo simple sin backend: `tips.json` se actualiza manualmente (descargar → reemplazar → commit → deploy)

## ✨ Características

### 🔍 Búsqueda (Sidebar)
- Resultados dinámicos a medida que escribes
- Resaltado de coincidencias en los títulos
- Click para abrir el tip en el visor

### 📰 Visor Markdown (Panel principal)
- Renderiza Markdown en modo lectura tipo “blog”
- Bloques de código y contenido formateado

### ➕ Agregar (Generar `tips.json` descargable)
- Formulario colapsable para agregar tips (nombre + URL)
- Permite agregar **varios** tips en una sesión
- Pregunta con confirmación si deseas agregar otro tip
- Descarga un `tips.json` combinado
- Por control: lo agregado **no aparece** en búsqueda hasta que actualices el `tips.json` del proyecto y despliegues

### ✍️ Crear (Editor Markdown)
- Editor para escribir tips en Markdown
- Vista previa del Markdown antes de descargar
- Descarga del tip como archivo `.md`

## 🧱 Tecnologías
- HTML5
- CSS3
- JavaScript (Vanilla)
- Marked.js (parser Markdown → HTML)

## 📁 Estructura del proyecto

```txt
buscatips/
├─ index.html
├─ tips.json
├─ README.md
├─ css/
│  ├─ style.css
│  └─ fonts.css
├─ js/
│  ├─ script.js
│  └─ libreria.js
└─ images/
   └─ code.ico