<?php
// Simular una petición POST para crear un tip
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = []; // Vaciar POST normal

// Simular JSON en el body
$jsonData = json_encode([
  'nombre' => 'Git Básico - Comandos Esenciales',
  'contenido' => "# Git Básico\n\n## Comandos Principales\n\n- `git init` - Inicializar repositorio\n- `git add .` - Agregar cambios\n- `git commit -m \"mensaje\"` - Confirmar cambios\n- `git push` - Subir al remoto\n\n**Nota:** Este es un tip de prueba."
]);

// Simular el input stream
file_put_contents('php://input', $jsonData);

// Incluir el archivo de la API
require_once 'tips.php';
