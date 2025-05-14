<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Seules les requêtes POST sont acceptées']);
    exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!$data || !isset($data['paddlePosition']) || !isset($data['ballPosition']) || !isset($data['ballDirection'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

// Constantes
$paddleY = $data['paddlePosition'];
$ball = $data['ballPosition'];
$dir = $data['ballDirection'];

$GAME_WIDTH = 800;
$GAME_HEIGHT = 600;
$BALL_SIZE = 10;
$PADDLE_HEIGHT = 100;
$PADDLE_CENTER_OFFSET = $PADDLE_HEIGHT / 2;
$PADDLE_SPEED = 5; // Vitesse par 10ms dans ton moteur JS
$TICK_INTERVAL = 1000; // en ms (1 seconde ici)
$TICKS_PER_SECOND = 1000 / 10; // car tu simules toutes les 10ms
$MAX_DURATION = 1000;

// Fonction pour prédire la position future de la balle sur l’axe Y
function predict_ball_y($ballX, $ballY, $vx, $vy, $targetX, $gameHeight, $ballSize) {
    $futureY = $ballY;
    $dx = $targetX - $ballX;

    if ($vx == 0) return $ballY; // ne devrait pas arriver

    $steps = abs($dx / $vx);
    for ($i = 0; $i < $steps; $i++) {
        $futureY += $vy;

        if ($futureY <= 0) {
            $futureY = -$futureY;
            $vy = -$vy;
        }

        if ($futureY >= $gameHeight - $ballSize) {
            $futureY = 2 * ($gameHeight - $ballSize) - $futureY;
            $vy = -$vy;
        }
    }
    return $futureY;
}

// IA principale
$direction = 'none';
$duration = 0;

if ($dir['x'] < 0) {
    // Balle vient vers la gauche, on prédit la position future
    $predictedY = predict_ball_y($ball['x'], $ball['y'], $dir['x'], $dir['y'], 10, $GAME_HEIGHT, $BALL_SIZE);
    $targetY = $predictedY - $PADDLE_CENTER_OFFSET;
} else {
    // Balle repart, on retourne au centre
    $targetY = ($GAME_HEIGHT - $PADDLE_HEIGHT) / 2;
}

$delta = $targetY - $paddleY;

if (abs($delta) > 3) {
    $direction = $delta > 0 ? 'down' : 'up';
    // Convertit le déplacement requis en durée, arrondi à 10ms près
    $duration = min($MAX_DURATION, max(100, abs($delta / $PADDLE_SPEED) * 10));
}

echo json_encode([
    'direction' => $direction,
    'duration' => round($duration)
]);
