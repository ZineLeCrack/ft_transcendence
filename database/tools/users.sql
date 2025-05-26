PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_pic TEXT DEFAULT 'uploads/default.png'
);

CREATE TABLE stats (
    game_playeds INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    loses INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    tournament_playeds INTEGER NOT NULL,
    tournament_wins INTEGER NOT NULL,
    tournament_loses INTEGER NOT NULL,
    id_player INTEGER NOT NULL,
    FOREIGN KEY (id_player) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE history (
    id_game INTEGER PRIMARY KEY AUTOINCREMENT,
    id_player1 INTEGER NOT NULL,
    id_player2 INTEGER NOT NULL,
    point_player1 INTEGER NOT NULL,
    point_player2 INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (id_player1) REFERENCES users(id) ON DELETE CASCADE
    FOREIGN KEY (id_player2) REFERENCES users(id) ON DELETE CASCADE
);
