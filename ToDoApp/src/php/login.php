<?php
// Fehleranzeige aktivieren
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS-Header hinzufügen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Prüfe die Anfrage-Methode
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

// Benutzername und Passwort erhalten
$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Debug-Ausgabe der POST-Daten
file_put_contents('php://stdout', "POST Data: " . print_r($_POST, true));

// Verbindungsinformationen für die Datenbank
$config = require_once __DIR__ . '/../../config/config.php';
$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

// Verbindung überprüfen
if ($conn->connect_error) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
    exit();
}

// Benutzer prüfen
$sql = "SELECT id, password_hash FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password_hash'])) {
        // Login erfolgreich, Benutzer-ID zurückgeben und Session starten
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;
        
        // Setze den Session-Cookie mit SameSite=None
        setcookie(session_name(), session_id(), [
            'expires' => time() + (14 * 24 * 60 * 60), // Lebensdauer des Cookies
            'path' => '/', // Pfad für das Cookie
            'domain' => '', // Optional: gib die Domain an
            'secure' => true, // Cookie nur über HTTPS senden
            'httponly' => true, // JavaScript-Zugriff verhindern
            'samesite' => 'None' // SameSite-Attribut auf None setzen
        ]);

        echo json_encode(['user_id' => $user['id']]);
    } else {
        echo json_encode(['error' => 'Ungültige Anmeldedaten']);
    }
} else {
    echo json_encode(['error' => 'Benutzer nicht gefunden']);
}

$conn->close();
?>
