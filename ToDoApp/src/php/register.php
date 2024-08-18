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

// Session starten
session_start();

// Hole die POST-Daten
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['username']) && isset($data['password'])) {
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

    $conn->begin_transaction(); // Beginne eine Transaktion

    try {
        // Bereite das Statement zum Einfügen des neuen Benutzers vor
        $stmt = $conn->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        if (!$stmt) {
            throw new Exception('Fehler beim Vorbereiten des Statements: ' . $conn->error);
        }

        $stmt->bind_param("ss", $username, $hashedPassword);

        if (!$stmt->execute()) {
            throw new Exception('Fehler beim Einfügen des Benutzers: ' . $stmt->error);
        }

        // Benutzer-ID aus der eingefügten Zeile holen
        $user_id = $conn->insert_id;

        // Bereite das Statement zum Einfügen der Benutzereinstellungen vor
        $stmt_settings = $conn->prepare("INSERT INTO user_settings (user_id, notifications, intervalLength) VALUES (?, ?, ?)");
        $notifications = 0;
        $intervalLength = 3600000; // Millisekunden

        if (!$stmt_settings) {
            throw new Exception('Fehler beim Vorbereiten des Statements für Benutzereinstellungen: ' . $conn->error);
        }

        $stmt_settings->bind_param("iii", $user_id, $notifications, $intervalLength);

        if (!$stmt_settings->execute()) {
            throw new Exception('Fehler beim Einfügen der Benutzereinstellungen: ' . $stmt_settings->error);
        }

        $conn->commit(); // Bestätige die Transaktion

        // Session-Cookie setzen
        setcookie(session_name(), session_id(), [
            'expires' => time() + (14 * 24 * 60 * 60), // Lebensdauer des Cookies
            'path' => '/', // Pfad für das Cookie
            'domain' => '', // Optional: gib die Domain an
            'secure' => true, // Cookie nur über HTTPS senden
            'httponly' => true, // JavaScript-Zugriff verhindern
            'samesite' => 'None' // SameSite-Attribut auf None setzen
        ]);
        
        // Rückgabe von Erfolg und user_id
        echo json_encode([
            'user_id' => $user_id // Rückgabe der user_id
        ]);

        $stmt->close();
        $stmt_settings->close();
    } catch (Exception $e) {
        $conn->rollback(); // Rolle die Transaktion zurück im Fehlerfall
        echo json_encode(['error' => $e->getMessage()]);
    }

    $conn->close();
} else {
    echo json_encode(['error' => 'Ungültige Eingabedaten']);
}
?>
