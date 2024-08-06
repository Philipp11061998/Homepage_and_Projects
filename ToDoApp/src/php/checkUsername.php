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

// Sicherstellen, dass Benutzerdaten vorhanden sind
if (!isset($data['username']) || empty($data['username'])) {
    echo json_encode(['error' => 'Benutzername fehlt']);
    exit();
}

$username = $data['username'];

// Verbindungsinformationen für die Datenbank
$config = require_once __DIR__ . '/../../config/config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

// Verbindung überprüfen
if ($conn->connect_error) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
    exit();
}

// Benutzername auf Einzigartigkeit prüfen
$sql = "SELECT id FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Benutzername bereits vergeben
    echo json_encode(['exists' => true]);
} else {
    // Benutzername verfügbar
    echo json_encode(['exists' => false]);
}

$stmt->close();
$conn->close();
?>
