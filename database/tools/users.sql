PRAGMA foreign_keys = ON;

CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	aliastournament TEXT DEFAULT '',
	profile_pic BLOB,
	status INTEGER DEFAULT 0 -- 0: offline, 1: online
);

CREATE TABLE stats (
	games_played INTEGER DEFAULT 0,
	wins INTEGER DEFAULT 0,
	loses INTEGER DEFAULT 0,
	total_points INTEGER DEFAULT 0,
	tournaments_played INTEGER DEFAULT 0,
	tournaments_win INTEGER DEFAULT 0,
	tournaments_lose INTEGER DEFAULT 0,
	id_player INTEGER NOT NULL,
	FOREIGN KEY (id_player) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE history (
	id_game INTEGER PRIMARY KEY AUTOINCREMENT,
	id_player1 INTEGER NOT NULL,
	id_player2 INTEGER NOT NULL,
	point_player1 INTEGER NOT NULL,
	point_player2 INTEGER NOT NULL,
	tournament INTEGER DEFAULT 0,
	tournamentId INTEGER DEFAULT 0,
	game_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_player1) REFERENCES users(id) ON DELETE CASCADE
	FOREIGN KEY (id_player2) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE friend (
	id_player1 INTEGER NOT NULL,
	id_player2 INTEGER NOT NULL,
	friend INTEGER DEFAULT 0, -- 0: not friends, 1: friends 2: request sent, 3: request received
	FOREIGN KEY (id_player1) REFERENCES users(id) ON DELETE CASCADE
	FOREIGN KEY (id_player2) REFERENCES users(id) ON DELETE CASCADE
	UNIQUE(id_player1, id_player2)

);

CREATE TABLE block (
	id_player1 INTEGER NOT NULL,
	id_player2 INTEGER NOT NULL,
	blocked INTEGER DEFAULT 0, -- 0: not blocked, 1: blocked
	FOREIGN KEY (id_player1) REFERENCES users(id) ON DELETE CASCADE
	FOREIGN KEY (id_player2) REFERENCES users(id) ON DELETE CASCADE
	UNIQUE(id_player1, id_player2)
);