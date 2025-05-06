import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let padY = 100;

app.post('/move', (req, res) =>
{
	const { key } = req.body;
	if (key === 'ArrowUp') padY -= 10;
	if (key === 'ArrowDown') padY += 10;

	padY = Math.max(0, Math.min(250, padY));
	res.sendStatus(200);
});


app.get('/state', (req, res) =>
{
	res.json({ padY });
});

app.listen(port, () =>
{
	console.log("Serveur HTTP lancé sur http://localhost:${port}");
});
