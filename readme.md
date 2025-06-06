insert into history (id_player1, id_player2, point_player1, point_player2, game_date) values (1, 2, 4, 5, '21/05/25 9:06');

insert into stats (game_playeds, wins, loses, total_points, tournament_playeds, tournament_wins, tournament_loses, id_player) values (10, 6, 4, 42, 0, 0, 0, 1);


quand on fait /game/multi ou autre game faut faire un fetch si le gameid existe dans sessionstorage et savoir si c'est bien une partie lancer sinon erreur de fetch en boucle