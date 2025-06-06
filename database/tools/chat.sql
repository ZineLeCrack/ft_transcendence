PRAGMA foreign_keys = ON;

CREATE TABLE chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE privatechat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username1 TEXT NOT NULL,
    username2 TEXT NOT NULL,
    content TEXT NOT NULL,
    pongRequest INTEGER DEFAULT 0

);