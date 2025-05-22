"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb_user = getDb_user;
exports.getDb_chat = getDb_chat;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
async function getDb_user() {
    return (0, sqlite_1.open)({
        filename: './user.db',
        driver: sqlite3_1.default.Database,
    });
}
async function getDb_chat() {
    return (0, sqlite_1.open)({
        filename: './chat.db',
        driver: sqlite3_1.default.Database,
    });
}
