<?php
// ai.php

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// Exemple des données attendues :
$ball = $input['ball'];      // ex: [ 'x' => 100, 'y' => 200, 'vx' => 4, 'vy' => -2 ]
$paddle = $input['paddle'];  // ex: [ 'y' => 180 ]

// Prédire la position de la balle dans 1 seconde (à 60 FPS)
$predicted_y = $ball['y'] + $ball['vy'] * 60;

// Décider de la direction
if ($paddle['y'] < $predicted_y - 5) {
    $direction = 'down';
} elseif ($paddle['y'] > $predicted_y + 5) {
    $direction = 'up';
} else {
    $direction = 'up'; // choisir arbitrairement si très proche (ou "none" si supporté)
}
echo "up";
// Répondre comme le testeur s’attend
echo json_stringify(['direction' => $direction]);
