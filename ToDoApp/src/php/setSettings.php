<?php
// Fehleranzeige aktivieren
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS-Header hinzufügen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Prüfe die Anfrage-Methode
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

// Hole die POST-Daten
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['user_id'])) {
    $user_id = (int)$data['user_id'];
    // Convert boolean notifications to integer (1 or 0)
    $notifications = isset($data['notifications']) ? ($data['notifications'] ? 1 : 0) : null;
    $intervalLength = isset($data['intervalLength']) ? (int)$data['intervalLength'] : null;

    // Verbindungsinformationen für die Datenbank
    $config = require_once __DIR__ . '/../../config/config.php';
    $conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

    // Verbindung überprüfen
    if ($conn->connect_error) {
        echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
        exit();
    }

    // Erstelle das SQL-Update-Statement dynamisch basierend auf den übergebenen Parametern
    $updateFields = [];
    $params = [];
    $paramTypes = '';

    if ($notifications !== null) {
        $updateFields[] = "notifications = ?";
        $params[] = $notifications;
        $paramTypes .= 'i';
    }

    if ($intervalLength !== null) {
        $updateFields[] = "intervalLength = ?";
        $params[] = $intervalLength;
        $paramTypes .= 'i';
    }

    if (empty($updateFields)) {
        echo json_encode(['error' => 'Keine Daten zum Aktualisieren übergeben']);
        exit();
    }

    // Erstelle das vollständige SQL-Update-Statement
    $sql = "UPDATE user_settings SET " . implode(', ', $updateFields) . " WHERE user_id = ?";
    $params[] = $user_id;
    $paramTypes .= 'i';

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Fehler beim Vorbereiten des Statements: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param($paramTypes, ...$params);

    try {
        $stmt->execute();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Fehler beim Aktualisieren der Einstellungen: ' . $e->getMessage()]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Ungültige Eingabedaten']);
}
?>
