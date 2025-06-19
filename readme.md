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

tous le monde - lire le sujet, connaitre son code, trouver erreur et regler erreur

<------------------------------------------------->

ebroudic - enlever l'input du chat quand on est dans notre liste d'amis et qu'on a pas choisi de conversation si on a le temps

<------------------------------------------------->

J'ai eu une erreur quand je suis allé dans modifié le mot de pass
J'ai eu une erreur où la photo de profil n'apparaîssait pas dans le home en haut à droite et en allant dans mes stats c'est parti en couille dans la console
J'ai eu une erreur quand je suis allé dans une partie multi et elle ne s'est pas lancée

<------------------------------------------------->

pas vu d'erreur perso a part quand le token expire le websocket disparait completement aucune error rien mais disparait et impossible a verifier du moins je ne sais pas comment, et quand on est en partie le player1 a plein d'erreur de fetchstate avec un truc undefined je crois c'est qu'il essaie de dessiner le jeu alors que je suis dans le home et quand je suis arriver sur le home, aucun script se lancer et le verifuser m'a renvoyer vers la page login donc techniquement que des erreurs consoles mais pas d'erreur visuel pour le client a part un lagguy (l'historique ce met bien), juste le websocket qui disparrait a voir ca

signed by ebroudic

<------------------------------------------------->

y'a des portions de codes avec des variable ou autre en FR faut les supprimer ou mettre en anglais !!