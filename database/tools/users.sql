PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE stats (
    game_playeds INTEGER NOT NULL,
    wins INTEGER NOT NULL,
    looses INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    tournament_playeds INTEGER NOT NULL,
    tournament_wins INTEGER NOT NULL,
    tournament_looses INTEGER NOT NULL,
    id_player INTEGER NOT NULL,
    FOREIGN KEY (id_player) REFERENCES users(id) ON DELETE CASCADE
);
