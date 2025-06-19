lelanglo - URGENT - Mettre token en memoire RAM
lelanglo - traduction quand quelqu'un a gagné en local/ai à réparer

<----------COMMENT--TESTER--LE--CLI--?------------>

curl -X {POST ou GET} https://{IP}{chemin vers le POST ou GET} {-k: pour certificate auto-signé}  \
	-H {header} "Content-Type: application/json" \
	-d {body} '{"gameId": "abc123"}'

EXEMPLE:

curl -X POST https://10.12.200.81/api/main/game/start -k

ET:

curl -X POST https://10.12.200.81/api/main/game/end -k \
	-H "Content-Type: application/json" \
	-d '{"gameId": "??????"}'

<------------------------------------------------->

tous le monde - si on a le temps faire une doc sur nos programmes plus simple pour expliquer a Alexandru et au autre pas besoin d'expliquer en detail juste dire ce que les fonction resoult comme probleme ou module 

ebroudic - enlever l'input du chat quand on est dans notre liste d'amis et qu'on a pas choisi de conversation 

tous le monde - lire le sujet, connaitre son code, trouver erreur et regler erreur

quand y'a un 405 dans l'a2f, je crois c'est quand on rentre le code trop rapidement :

Loading failed for the module with source “https://10.12.200.86/assets/a2f-BM47Gd88.js”. a2f
Error loading script for /login/a2f: TypeError: error loading dynamically imported module: https://10.12.200.86/assets/a2f-BM47Gd88.js index-YMBjik5J.js:1326:4450
POST
https://10.12.200.86/login/a2f
[HTTP/1.1 405 Not Allowed 5ms]

This page is in Quirks Mode. Page layout may be impacted. For Standards Mode use “<!DOCTYPE html>”. a2f
