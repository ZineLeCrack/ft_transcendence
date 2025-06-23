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

<---------------------------------------------->
