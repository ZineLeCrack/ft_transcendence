import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const privateKey = fs.readFileSync('/certs/transcend.key', 'utf8');
const certificate = fs.readFileSync('/certs/transcend.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const dbPath = './user.db';

https.createServer(credentials, app).listen(3452, '0.0.0.0', () =>
{
	console.log('HTTPS database server running at https://10.12.200.78:3452');
});
