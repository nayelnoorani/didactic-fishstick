const express = require('express');
const router = express.Router();
const GameEngine = require('./gameEngine');

const activeGame = new GameEngine();

// POST /start – start a new game
router.post('/start', async (req, res) => {
  try {
    const initialHint = await activeGame.startNewGame();
    res.json({
      gameId: activeGame.gameId,
      initialHint,
    });
  } catch (err) {
    console.error("Error starting game:", err);
    res.status(500).json({ error: "Failed to start game" });
  }
});

// POST /guess – process a guess
router.post('/guess', async (req, res) => {
  const { gameId, userMessage } = req.body;

  if (userMessage.length > 200) {
    return res.status(400).json({ error: "Message too long" });
  }

  const disallowedPatterns = /(ignore|disregard|forget|pretend|system instruction|role:|prompt:)/i;
  if (disallowedPatterns.test(userMessage)) {
    return res.status(400).json({ error: "Invalid input content." });
  }

  if (gameId !== activeGame.gameId) {
    return res.status(400).json({ error: "Invalid game ID" });
  }

  try {
    const result = await activeGame.playTurn(userMessage);
    res.json(result);
  } catch (err) {
    console.error("Error processing guess:", err);
    res.status(500).json({ error: "Failed to process guess" });
  }
});

module.exports = router;