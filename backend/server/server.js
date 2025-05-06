"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let padY = 100; // position verticale du pad
// Endpoint pour recevoir les touches du client
app.post('/move', (req, res) => {
    const { key } = req.body;
    if (key === 'ArrowUp')
        padY -= 10;
    if (key === 'ArrowDown')
        padY += 10;
    padY = Math.max(0, Math.min(250, padY)); // limite dans le canvas
    res.sendStatus(200);
});
// Endpoint pour envoyer la position du pad au client
app.get('/state', (req, res) => {
    res.json({ padY });
});
app.listen(port, () => {
    console.log(`Serveur HTTP lancé sur http://localhost:${port}`);
});
