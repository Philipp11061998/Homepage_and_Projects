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

if (isset($data['user_id']) && isset($data['tasks'])) {
    $user_id = (int)$data['user_id'];
    $tasks = $data['tasks'];

    // Verbindungsinformationen für die Datenbank
    $config = require_once __DIR__ . '/../../config/config.php';
    $conn = new mysqli($config['db_host'], $config['db_user'], $config['db_pass'], $config['db_name']);

    // Verbindung überprüfen
    if ($conn->connect_error) {
        echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $conn->connect_error]);
        exit();
    }

    // Bereite das Statement zum Aktualisieren von Aufgaben vor
    $stmt = $conn->prepare("UPDATE tasks SET beschreibung = ?, fertig = ? WHERE user_id = ? AND id = ?");

    if (!$stmt) {
        echo json_encode(['error' => 'Fehler beim Vorbereiten des Statements: ' . $conn->error]);
        exit();
    }

    $conn->begin_transaction(); // Beginne eine Transaktion

    try {
        foreach ($tasks as $task) {
            // Überprüfe, ob die Aufgabe die erforderlichen Parameter hat
            if (isset($task['id']) && isset($task['beschreibung']) && isset($task['fertig'])) {
                $beschreibung = $task['beschreibung'];
                $fertig = (bool)$task['fertig'];
                $task_id = (int)$task['id'];

                $stmt->bind_param("siii", $beschreibung, $fertig, $user_id, $task_id);
                $stmt->execute();
            } else {
                throw new Exception('Fehlende Parameter in der Aufgabe');
            }
        }
        $conn->commit(); // Bestätige die Transaktion
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollback(); // Rolle die Transaktion zurück im Fehlerfall
        echo json_encode(['error' => 'Fehler beim Aktualisieren der Aufgaben: ' . $e->getMessage()]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Ungültige Eingabedaten']);
}
?>
