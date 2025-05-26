import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDb_user() {
	return open({
		filename: './user.db',
		driver: sqlite3.Database,
	});
}

export async function getDb_chat() {
	return open({
		filename: './chat.db',
		driver: sqlite3.Database,
	});
}
