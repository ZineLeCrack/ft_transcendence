import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb_user() {
	return open({
		filename: '/database/users.db',
		driver: sqlite3.Database,
	});
}

export async function getDb_chat() {
	return open({
		filename: '/database/chat.db',
		driver: sqlite3.Database,
	});
}

export async function getDb_tournaments() {
	return open({
		filename: '/database/tournaments.db',
		driver: sqlite3.Database,
	});
}

