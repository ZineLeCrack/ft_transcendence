<----------HOW-TO-TEST--THE--CLI--?------------>

curl -X {POST or GET} https://{IP}{path to the POST or GET} {-k: for autosigned certificate }  \
	-H {header} "Content-Type: application/json" \
	-d {body} '{"gameId": "abc123"}'

EXEMPLE:

curl -X POST https://10.12.200.81/api/main/game/start -k

and:

curl -X POST https://10.12.200.81/api/main/game/end -k \
	-H "Content-Type: application/json" \
	-d '{"gameId": "??????"}'

<------------------------------------------------->

tous le monde - si on a le temps faire une doc sur nos programmes plus simple pour expliquer a Alexandru et au autre pas besoin d'expliquer en detail juste dire ce que les fonction resoult comme probleme ou module

<------------------------------------------------->

ebroudic - enlever l'input du chat quand on est dans notre liste d'amis et qu'on a pas choisi de conversation

<------------------------------------------------->

tous le monde - lire le sujet, connaitre son code, trouver erreur et regler erreur

<------------------------------------------------->

ebroudic - enlever l'input du chat quand on est dans notre liste d'amis et qu'on a pas choisi de conversation si on a le temps

<------------------------------------------------->

J'ai eu une erreur quand je suis allé dans modifié le mot de pass
J'ai eu une erreur où la photo de profil n'apparaîssait pas dans le home en haut à droite et en allant dans mes stats c'est parti en couille dans la console
J'ai eu une erreur quand je suis allé dans une partie multi et elle ne s'est pas lancée
