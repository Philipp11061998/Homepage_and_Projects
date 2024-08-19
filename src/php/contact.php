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

// Verbindungsinformationen für die Datenbank
$config = require_once __DIR__ . '/../config/config.php';

$conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

// Verbindung überprüfen
if ($conn->connect_error) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
    exit();
}

// Eingehende JSON-Daten lesen
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['email']) && isset($data['message'])) {
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $message = $conn->real_escape_string($data['message']);

    $sql = "INSERT INTO contacts (name, email, message) VALUES ('$name', '$email', '$message')";

    if ($conn->query($sql) === TRUE) {
        // E-Mail-Versand
        $to = 'philipp@philippk.name';
        $subject = 'Neuer Kontakt: ' . $name;
        $emailMessage = "Name: $name\n";
        $emailMessage .= "Email: $email\n";
        $emailMessage .= "Message: $message\n";

        $headers = "From: $email" . "\r\n" .
                   "Reply-To: $email" . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $emailMessage, $headers)) {
            echo json_encode(['success' => 'Daten erfolgreich gespeichert und E-Mail gesendet']);
        } else {
            echo json_encode(['error' => 'Daten gespeichert, aber Fehler beim Senden der E-Mail']);
        }
    } else {
        echo json_encode(['error' => 'Fehler beim Speichern der Daten: ' . $conn->error]);
    }
} else {
    echo json_encode(['error' => 'Ungültige Eingabedaten']);
}

$conn->close();
?>
