PRAGMA foreign_keys = ON;

CREATE TABLE chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL
);