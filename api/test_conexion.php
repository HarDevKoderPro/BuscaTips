<?php
require_once 'config.php';

try {
  $db = obtenerConexion();
  echo json_encode([
    'success' => true,
    'message' => '✅ Conexión exitosa a la base de datos',
    'database' => DB_NAME,
    'host' => DB_HOST
  ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
  echo json_encode([
    'success' => false,
    'message' => '❌ Error de conexión: ' . $e->getMessage()
  ], JSON_UNESCAPED_UNICODE);
}
