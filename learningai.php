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

// Paramètres
$paddlePosition = $data['paddlePosition'];
$ballPosition = $data['ballPosition'];
$ballDirection = $data['ballDirection'];

$actions = ['up', 'down', 'none'];
$epsilon = 0.1;
$alpha = 0.1;
$gamma = 0.9;

$qFile = 'q_table.json';
$qTable = file_exists($qFile) ? json_decode(file_get_contents($qFile), true) : [];

// Fonction pour discrétiser l'état
function getState($ballPosition, $ballDirection, $paddlePosition) {
    $ballX = floor($ballPosition['x'] / 100); // 0–8
    $ballY = floor($ballPosition['y'] / 100); // 0–6
    $dirX = $ballDirection['x'] > 0 ? 1 : -1;
    $dirY = $ballDirection['y'] > 0 ? 1 : -1;
    $paddle = floor($paddlePosition / 50); // 0–10
    return "$ballX|$ballY|$dirX|$dirY|$paddle";
}

// Obtenir état actuel
$state = getState($ballPosition, $ballDirection, $paddlePosition);

// Initialiser si vide
if (!isset($qTable[$state])) {
    $qTable[$state] = array_fill_keys($actions, 0);
}

// Choix de l'action (ε-greedy)
if (mt_rand() / mt_getrandmax() < $epsilon) {
    $action = $actions[array_rand($actions)];
} else {
    $action = array_search(max($qTable[$state]), $qTable[$state]);
}

// Appliquer l’action
$direction = $action;
$duration = 100; // constant, ou ajustable si tu veux

// Simuler récompense binaire simple (tu peux améliorer selon le contexte réel)
$reward = 0;
if ($ballDirection['x'] > 0 && abs($ballPosition['y'] - ($paddlePosition + 50)) < 50) {
    $reward = 1; // bon alignement
} elseif ($ballDirection['x'] > 0 && abs($ballPosition['x'] - 780) < 10) {
    $reward = -1; // balle presque ratée
}

// Prochain état simulé
$futurePaddle = $paddlePosition + ($action === 'down' ? 20 : ($action === 'up' ? -20 : 0));
$futurePaddle = max(0, min(500, $futurePaddle));
$nextState = getState($ballPosition, $ballDirection, $futurePaddle);

// Initialiser si vide
if (!isset($qTable[$nextState])) {
    $qTable[$nextState] = array_fill_keys($actions, 0);
}

// Mise à jour Q-table
$qTable[$state][$action] += $alpha * (
    $reward + $gamma * max($qTable[$nextState]) - $qTable[$state][$action]
);

// Sauvegarder Q-table
file_put_contents($qFile, json_encode($qTable));

// Répondre
$response = [
    'direction' => $direction,
    'duration' => $duration
];
echo json_encode($response);
