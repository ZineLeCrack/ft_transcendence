<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Seules les requêtes POST sont acceptées']);
    exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!$data || !isset($data['paddlePosition']) || !isset($data['ballPosition']) || !isset($data['ballDirection'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides. Format attendu: { paddlePosition: number, ballPosition: { x: number, y: number }, ballDirection: { x: number, y: number } }']);
    exit;
}

// $log_file = 'pong_api.log';
// $log_entry = date('Y-m-d H:i:s') . " - Données reçues: " . $json_data . "\n";
// file_put_contents($log_file, $log_entry, FILE_APPEND);

//x max = 800
//y max = 600
//x max = 0
//y max = 0

//pos_paddle max = 500
//pos_paddle min = 0
//paddle_speed = 5
//angle de la balle(y) entre 3 et 7 en fonction de ou tape la ball sur le paddle
//vitesse de ball(x) = 5 + 0.5 a chaque touche de ball max = 10
$paddlePosition = $data['paddlePosition'];
$ballPosition = $data['ballPosition'];
$ballDirection = $data['ballDirection'];

$direction = 'none';
$duration = 500;

// Prévision de la position dans 1 seconde
$future_x = $ballPosition['x'] + $ballDirection['x'] * 60;
$future_y = $ballPosition['y'] + $ballDirection['y'] * 60;

// Rebond Y simple (1 seul rebond, pour l’instant)
if ($future_y > 600) {
    $future_y = 600 - ($future_y - 600);
} elseif ($future_y < 0) {
    $future_y = -$future_y;
}

if ($future_x){
    $delta = $future_y - $paddlePosition;
    $direction = $delta > 0 ? 'down' : 'up';
    $duration = min(1000, max(10, abs($delta) * 4));
}

// Répondre
$response = [
    'direction' => $direction,
    'duration' => $duration
];

echo json_encode($response);

