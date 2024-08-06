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
$username = $data['username'];
$password = $data['password'];

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
    echo json_encode(['error' => 'Benutzername bereits vergeben']);
    $conn->close();
    exit();
}

// Passwort hashen
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// Neuen Benutzer einfügen
$sql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password_hash);

if ($stmt->execute()) {
    // Registrierung erfolgreich, Session starten
    session_start();
    $_SESSION['user_id'] = $conn->insert_id;
    $_SESSION['username'] = $username;
    
    // Setze den Session-Cookie
    setcookie(session_name(), session_id(), time() + (14 * 24 * 60 * 60), '/', '', true, true);

    echo json_encode(['success' => 'Benutzer registriert']);
} else {
    echo json_encode(['error' => 'Fehler bei der Registrierung']);
}

$stmt->close();
$conn->close();
?>
