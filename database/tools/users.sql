PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE stats (
    game_played INTEGER NOT NULL,
    win INTEGER NOT NULL,
    lose INTEGER NOT NULL,
    total_point INTEGER NOT NULL,
    tournament_played INTEGER NOT NULL,
    tournament_win INTEGER NOT NULL,
    tournament_lose INTEGER NOT NULL,
    id_player INTEGER NOT NULL,
    FOREIGN KEY (id_player) REFERENCES users(id) ON DELETE CASCADE
);
