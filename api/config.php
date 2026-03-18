<?php
/**
 * ============================================================
 * BuscaTips - Configuración de Base de Datos
 * ============================================================
 * 
 * Este archivo maneja la conexión a la base de datos MySQL
 * usando PDO. Soporta entorno local (localhost) y producción.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo en tu servidor dentro de la carpeta /api/
 * 2. Configura las credenciales según tu entorno (local o producción)
 * 3. Asegúrate de que la base de datos y la tabla 'tips' ya existan
 * 
 * SEGURIDAD:
 * - En producción, este archivo NO debe ser accesible directamente desde el navegador
 * - Considera mover las credenciales a variables de entorno del servidor
 * ============================================================
 */

// ─── CONFIGURACIÓN DE ENTORNO ─────────────────────────────────
// Cambia a 'produccion' cuando subas al hosting
define('ENTORNO', 'local');

// ─── CREDENCIALES POR ENTORNO ─────────────────────────────────
if (ENTORNO === 'local') {
    // --- Entorno LOCAL (localhost / XAMPP / WAMP / Laragon) ---
    define('DB_HOST', 'localhost');
    define('DB_PORT', '3306');
    define('DB_NAME', 'tucultur_buscatips_db');
    define('DB_USER', 'tucultur');                    // Usuario local típico
    define('DB_PASS', '@GWMU!J4p-mgyTJ7');            // Contraseña local (vacía en XAMPP por defecto)
} else {
    // --- Entorno PRODUCCIÓN (Colombia Hosting / cPanel) ---
    define('DB_HOST', '190.8.176.115');                 // Generalmente 'localhost' en hosting compartido
    define('DB_PORT', '3306');
    define('DB_NAME', 'tucultur_buscatips_db');
    define('DB_USER', 'tucultur');            // Tu usuario de la base de datos
    define('DB_PASS', '@GWMU!J4p-mgyTJ7');       // ⚠️ CAMBIA ESTO por tu contraseña real
}

// ─── CHARSET ──────────────────────────────────────────────────
define('DB_CHARSET', 'utf8mb4');

// ─── ZONA HORARIA ─────────────────────────────────────────────
date_default_timezone_set('America/Bogota');

/**
 * Obtiene una conexión PDO a la base de datos.
 * 
 * Usa el patrón Singleton internamente para reutilizar la conexión
 * durante una misma petición HTTP.
 * 
 * @return PDO Instancia de conexión PDO
 * @throws PDOException Si la conexión falla (capturada internamente)
 */
function obtenerConexion(): PDO
{
    static $conexion = null;

    if ($conexion === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_CHARSET
        );

        $opciones = [
            // Lanzar excepciones en caso de error SQL
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,

            // Devolver resultados como arrays asociativos por defecto
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

            // Desactivar emulación de prepared statements (más seguro)
            PDO::ATTR_EMULATE_PREPARES   => false,

            // Usar conexiones persistentes para mejor rendimiento
            PDO::ATTR_PERSISTENT         => false,
        ];

        try {
            $conexion = new PDO($dsn, DB_USER, DB_PASS, $opciones);

            // Establecer charset a nivel de conexión (doble seguridad)
            $conexion->exec("SET NAMES " . DB_CHARSET);

        } catch (PDOException $e) {
            // En desarrollo mostramos el error; en producción lo ocultamos
            if (ENTORNO === 'local') {
                $mensaje = 'Error de conexión: ' . $e->getMessage();
            } else {
                // Registrar el error en el log del servidor
                error_log('BuscaTips DB Error: ' . $e->getMessage());
                $mensaje = 'Error interno del servidor. Intente más tarde.';
            }

            // Responder con JSON y código 500
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'message' => $mensaje
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    return $conexion;
}

/**
 * Envía una respuesta JSON estandarizada y termina la ejecución.
 * 
 * @param int    $codigoHttp  Código de estado HTTP (200, 201, 400, 404, 500)
 * @param bool   $exito       Indica si la operación fue exitosa
 * @param mixed  $datos       Datos a incluir en la respuesta (array, string, null)
 * @param string $mensaje     Mensaje descriptivo (opcional)
 */
function responderJSON(int $codigoHttp, bool $exito, $datos = null, string $mensaje = ''): void
{
    http_response_code($codigoHttp);
    header('Content-Type: application/json; charset=utf-8');

    $respuesta = ['success' => $exito];

    if (!empty($mensaje)) {
        $respuesta['message'] = $mensaje;
    }

    if ($datos !== null) {
        $respuesta['data'] = $datos;
    }

    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
