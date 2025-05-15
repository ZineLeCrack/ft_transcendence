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
//paddle_speed = 10
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
$PADDLE_SPEED = 10;

// Clone position/direction pour simulation
$x = $ballPosition['x'];
$y = $ballPosition['y'];
$vx = $ballDirection['x'];
$vy = $ballDirection['y'];

// Simulation simple : prédire où la balle frappera le mur droit
while ($x < $GAME_WIDTH - $BALL_SIZE) {
    $x += $vx;
    $y += $vy;

    // rebond haut/bas
    if ($y <= 0 || $y >= $GAME_HEIGHT - $BALL_SIZE) {
        $vy *= -1;
    }
}

// On ajoute un peu de "réflexion humaine" : au lieu de viser le centre
// on vise un offset aléatoire sur la raquette (haut, milieu, bas)
$targetY = $y - $PADDLE_HEIGHT / 2 + rand(-20, 20);

// Calcul du mouvement nécessaire
$diff = $targetY - $paddlePosition;
$maxMove = $PADDLE_SPEED * 1000 / 60; // estimation du max possible en 1s

// Clamp le mouvement pour simuler la limite de vitesse
$diff = max(-$maxMove, min($diff, $maxMove));

// Choix de direction et durée
if (abs($diff) < 5) {
    $direction = 'none';
    $duration = 0;
} else if ($diff > 0) {
    $direction = 'down';
    $duration = abs($diff) / $PADDLE_SPEED * 10; // ms
} else {
    $direction = 'up';
    $duration = abs($diff) / $PADDLE_SPEED * 10;
}

$response = [
    'direction' => $direction,
    'duration' => $duration
];

echo json_encode($response);
