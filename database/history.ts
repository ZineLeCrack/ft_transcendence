import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const IP_NAME = process.env.IP_NAME || "10.12.200.0";

const app = express();

const dbPath = './user.db';

app.use(cors());
app.use(express.json());

app.post('/history', async (req, res) =>
{
	const { userId } = req.body;

	try
	{
		const db = await getDb();
		const rows = await db.all('SELECT h.point_player1, h.point_player2, h.game_date, u2.name AS usernameplayer2 FROM history h \
			 						JOIN users u1 ON h.id_player1 = u1.id \
									JOIN users u2 ON h.id_player2 = u2.id \
									WHERE u1.id = ? OR u2.id = ? \
									ORDER BY h.game_date DESC', [userId, userId]);
		const formatted = rows.map(row => ({
			imageplayer1: "/src/images/pdp_cle-berr.png",
			imageplayer2: "/src/images/pdp_rlebaill.jpeg",
			usernameplayer2: row.usernameplayer2,
			pointplayer1: row.point_player1,
			pointplayer2: row.point_player2,
			date: row.game_date,
			result: row.point_player1 > row.point_player2 ? 'win' : 'lose'
		}));
		res.json(formatted);
	}
	catch (err)
	{
		console.error(err);
		res.status(500).send('Error');
	}
});

async function getDb()
{
	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}

https.createServer(credentials, app).listen(3453, '0.0.0.0', () =>
{
	console.log(`TTPS database server running at https://${IP_NAME}:3453`);
});