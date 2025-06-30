const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateCharacter, evaluateGuess } = require('./geminiClient');
const GameEngine = require('./gameEngine');
const activeGame = new GameEngine();
const gameRoutes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', gameRoutes);

app.get('/', (req, res) => {
  res.send('didactic-fishstick backend is running');
});

app.get('/start-game', async (req, res) => {
  const hint = await activeGame.startNewGame();
  res.send(`Game started. Initial hint: ${hint}`);
});

app.post('/play-turn', async (req, res) => {
  const { userMessage } = req.body;
  const result = await activeGame.playTurn(userMessage);
  res.json(result);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});