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

// Benutzerdaten erhalten
$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'], '"'); // Entferne zusätzliche Anführungszeichen
$user_id = isset($data['user_id']) ? (int)$data['user_id'] : 0;

// Verbindungsinformationen für die Datenbank
$config = require_once __DIR__ . '/../../config/config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

// Verbindung überprüfen
if ($conn->connect_error) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
    exit();
}

// Überprüfen, ob der Session-Cookie zu den Benutzerdaten passt
$sql = "SELECT id FROM users WHERE username = ? AND id = ?";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['error' => 'Fehler beim Vorbereiten der SQL-Anweisung: ' . $conn->error]);
    exit();
}
$stmt->bind_param("si", $username, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    echo json_encode(['valid' => true]);
} else {
    echo json_encode(['valid' => false, 'error' => 'Ungültige Session-Daten']);
}

$stmt->close();
$conn->close();
?>
