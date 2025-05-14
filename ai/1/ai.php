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
$duration = 0;

$GAME_WIDTH = 800;
$GAME_HEIGHT = 600;
$BALL_SIZE = 10;
$PADDLE_HEIGHT = 100;

// Si la balle va vers la gauche, on retourne doucement au centre
if ($ballDirection['x'] < 0) {
    $target = ($GAME_HEIGHT - $PADDLE_HEIGHT) / 2;
    $delta = $target - $paddlePosition;

    if (abs($delta) > 10) { // Seuil pour éviter de gigoter pour rien
        $direction = $delta > 0 ? 'down' : 'up';
        $duration = min(500, max(10, abs($delta) * 2));
    }
} else {
    $framesToRightWall = ($GAME_WIDTH - $BALL_SIZE - $ballPosition['x']) / $ballDirection['x'];

    // if ($framesToRightWall > 35)
    //     $framesToRightWall = 35;
    $future_y = $ballPosition['y'];
    $dir_y = $ballDirection['y'];

    for ($i = 0; $i < $framesToRightWall; $i++) {
        $future_y += $dir_y;

        if ($future_y <= 0) {
            $future_y = -$future_y;
            $dir_y = -$dir_y;
        }

        if ($future_y >= $GAME_HEIGHT - $BALL_SIZE) {
            $future_y = 2 * ($GAME_HEIGHT - $BALL_SIZE) - $future_y;
            $dir_y = -$dir_y;
        }
    }

    $delta = ($future_y - 50) - $paddlePosition;
    $direction = $delta > 0 ? 'down' : 'up';
    $duration = min(1000, max(10, abs($delta) * 4));
}

// Résultat
$response = [
    'direction' => $direction,
    'duration' => $duration
];

echo json_encode($response);


