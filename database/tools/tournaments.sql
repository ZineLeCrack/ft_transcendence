PRAGMA foreign_keys = ON;

CREATE TABLE tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
	players INTEGER NOT NULL DEFAULT 0,
    players_max INTEGER NOT NULL DEFAULT 8,
	type TEXT NOT NULL,
    player1 TEXT DEFAULT "?",
    player2 TEXT DEFAULT "?",
    player3 TEXT DEFAULT "?",
    player4 TEXT DEFAULT "?",
    player5 TEXT DEFAULT "?",
    player6 TEXT DEFAULT "?",
    player7 TEXT DEFAULT "?",
    player8 TEXT DEFAULT "?",
    password TEXT
);

CREATE TABLE result (
    id INTEGER,
    winner1 TEXT DEFAULT "?",
    loser1 TEXT DEFAULT "?",
    winner2 TEXT DEFAULT "?",
    loser2 TEXT DEFAULT "?",
    winner3 TEXT DEFAULT "?",
    loser3 TEXT DEFAULT "?",
    winner4 TEXT DEFAULT "?",
    loser4 TEXT DEFAULT "?",
    winner1_semifinals TEXT DEFAULT "?",
    loser1_semifinals TEXT DEFAULT "?",
    winner2_semifinals TEXT DEFAULT "?",
    loser2_semifinals TEXT DEFAULT "?",
    winner_final TEXT DEFAULT "?",
    loser_final TEXT DEFAULT "?",
    FOREIGN KEY (id) REFERENCES tournaments(id) ON DELETE CASCADE
);
