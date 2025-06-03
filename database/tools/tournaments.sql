PRAGMA foreign_keys = ON;

CREATE TABLE tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
	players INTEGER NOT NULL DEFAULT 0,
    players_max INTEGER NOT NULL DEFAULT 8,
	type TEXT NOT NULL,
    player1 TEXT DEFAULT 0,
    player3 TEXT DEFAULT 0,
    player2 TEXT DEFAULT 0,
    player4 TEXT DEFAULT 0,
    player5 TEXT DEFAULT 0,
    player6 TEXT DEFAULT 0,
    player7 TEXT DEFAULT 0,
    player8 TEXT DEFAULT 0,
    password TEXT
);