<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Vérification de la méthode de la requête
// On renvoie une erreur 200 si la méthode est OPTIONS
// Cela permet de gérer les requêtes CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Vérification de la méthode de la requête
// On ne traite les requêtes POST
// On renvoie une erreur 405 si la méthode n'est pas POST
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
// Récupération des données envoyées par le client
$paddlePosition = $data['paddlePosition'];
$ballPosition = $data['ballPosition'];
$ballDirection = $data['ballDirection'];


$direction = 'none';
$duration = 0;

// Paramètres du jeu
$GAME_WIDTH = 800;
$GAME_HEIGHT = 600;
$BALL_SIZE = 10;
$PADDLE_HEIGHT = 100;
$PADDLE_SPEED = 10;

function getMovementInfo(float $paddlePos, float $targetPos, float $paddleSpeed, float $framesUntilBall): array {
    $delta = $targetPos - $paddlePos;
    $distance = abs($delta);
    $direction = $delta > 0 ? 'down' : 'up';

    $framesNeeded = ceil($distance / $paddleSpeed);
    $durationMs = $framesNeeded * 16;

    $canReachInTime = $framesNeeded <= $framesUntilBall;

    return [
        'direction' => $direction,
        'duration' => $durationMs,
        'canReach' => $canReachInTime
    ];
}
// Si la balle se dirige vers la gauche, on se positionne au centre
if ($ballDirection['x'] < 0) {
    $target = ($GAME_HEIGHT - $PADDLE_HEIGHT) / 2;
    $delta = $target - $paddlePosition;

    if (abs($delta) > 10) {
        $direction = $delta > 0 ? 'down' : 'up';
        $duration = min(500, max(10, abs($delta / $PADDLE_SPEED) * 10));
    }
} else {
    // Si la balle se dirige vers la droite, on calcule le temps avant qu'elle touche le mur droit
    // et on détermine si on peut atteindre la position cible avant qu'elle ne touche le mur
    $framesToRightWall = ($GAME_WIDTH - $BALL_SIZE - $ballPosition['x']) / $ballDirection['x'];
    $future_y = $ballPosition['y'];
    $dir_y = $ballDirection['y'];
    // On simule le mouvement de la balle jusqu'au mur droit
    // en prenant en compte les rebonds sur le haut et le bas
    for ($i = 0; $i < $framesToRightWall; $i++) {
        $future_y += $dir_y;
        if ($future_y <= 0) {
            $future_y = -$future_y;
            $dir_y = -$dir_y;
        }

        if ($future_y >= $GAME_HEIGHT - $BALL_SIZE) {
            $future_y = 2 * ($GAME_HEIGHT - $BALL_SIZE) - $future_y;
        }
    }
    // On calcule la position cible du paddle
    // en fonction de la position future de la balle
    // et de la vitesse de la balle
    $target = $future_y - $PADDLE_HEIGHT / 2 + $BALL_SIZE / 2;
    $move = getMovementInfo($paddlePosition, $target, $PADDLE_SPEED, $framesToRightWall);

    if ($move['canReach']) {
        $direction = $move['direction'];
        $duration = $move['duration'];
    }    
}

$response = [
    'direction' => $direction,
    'duration' => $duration
];

echo json_encode($response);



