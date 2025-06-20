PRAGMA foreign_keys = ON;

CREATE TABLE chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    announceTournament INTEGER DEFAULT 0, -- 0 no resquest, 2 is your turn, 3 announce winner
    announceTournament_id1 INTEGER DEFAULT 0,
    announceTournament_id2 INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE privatechat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username1 TEXT NOT NULL,
    username2 TEXT NOT NULL,
    content TEXT NOT NULL,
    pongRequest INTEGER DEFAULT 0, -- 0 no resquest, 1 request send or received, 2 request accept, 3 request decline, 4 game finish
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);