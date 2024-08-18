<?php
// Fehleranzeige aktivieren
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS-Header hinzufügen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Prüfe die Anfrage-Methode
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

// Benutzer-ID und Benutzername aus der URL abholen
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$username = isset($_GET['username']) ? $_GET['username'] : '';

// Verbindungsinformationen für die Datenbank
$config = require_once __DIR__ . '/../../config/config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

// Verbindung überprüfen
if ($conn->connect_error) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
    exit();
}

// Überprüfe, ob die Benutzer-ID und der Benutzername übereinstimmen
$sql = "SELECT id FROM users WHERE id = ? AND username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // Aufgaben des Benutzers abfragen
    $sql = "SELECT * FROM user_settings WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Ergebnisse in ein Array umwandeln
    $notifications = $result->fetch_assoc();
    
    echo json_encode($notifications);
} else {
    echo json_encode(['error' => 'Unzulässiger Zugriff oder Benutzer nicht gefunden']);
}

$stmt->close();
$conn->close();
?>
