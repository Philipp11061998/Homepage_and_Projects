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

// Debug: Protokolliere empfangene Daten
error_log(print_r($data, true));

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
    $stmt = $conn->prepare("UPDATE tasks SET beschreibung = ?, fertig = ?, Goal_Date = ? WHERE user_id = ? AND id = ?");

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
                $fertig = (int)$task['fertig']; // Umwandlung in Integer (0 oder 1)
                $task_id = (int)$task['id'];

                // Konvertiere das Datum ins Format YYYY-MM-DD
                $task_Goal_Date = isset($task['Goal_Date']) ? date('Y-m-d', strtotime(str_replace('.', '-', $task['Goal_Date']))) : null;

                // Debug: Protokolliere Werte vor Bindung
                error_log("Beschreibung: $beschreibung, Fertig: $fertig, Goal_Date: $task_Goal_Date, User_ID: $user_id, Task_ID: $task_id");

                $stmt->bind_param("siisi", $beschreibung, $fertig, $task_Goal_Date, $user_id, $task_id);

                if (!$stmt->execute()) {
                    echo json_encode(['error' => 'Fehler beim Ausführen des Statements: ' . $stmt->error]);
                    exit();
                }
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
