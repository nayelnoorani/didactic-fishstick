const { generateCharacterAndHint, evaluateGuess } = require('./geminiClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GameEngine {
  constructor() {
    this.gameId = null;
    this.character = null;
    this.initialHint = null;
    this.finalOutcome = null;
    this.turn = 1;
    this.turns = []; // Stores {turn, userMessage, userGuess, geminiResponse}
  }

  // Starts a new game
  async startNewGame() {
    const { character, initialHint } = await generateCharacterAndHint();

    this.character = character;
    this.initialHint = initialHint;

    // Create game in DB
    const game = await prisma.game.create({
      data: {
        character: this.character,
        result: null,
      },
    });

    this.gameId = game.id;

    // Record initial hint as turn 0
    this.turns.push({
      turn: 0,
      userMessage: null,
      userGuess: null,
      geminiResponse: this.initialHint,
    });

    return this.initialHint; // return hint string only
  }

  // Plays one turn of the game
  async playTurn(userMessage) {
    const geminiResponse = await evaluateGuess(this.character, userMessage, this.turns);

    // Save turn metadata
    this.turns.push({
      turn: this.turn,
      userMessage,
      userGuess: geminiResponse.userGuess,
      geminiResponse: geminiResponse.newHint,
    });

    // Check win or max turns
    if (geminiResponse.isCorrect || this.turn >= 20) {
      this.finalOutcome = geminiResponse.isCorrect ? "win" : "loss";

      // Write game result to DB
      await prisma.game.update({
        where: { id: this.gameId },
        data: {
          result: this.finalOutcome,
          endTime: new Date(),
        },
      });

      // Write turn metadata to DB
      for (const t of this.turns) {
        await prisma.question.create({
          data: {
            gameId: this.gameId,
            questionText: t.userMessage || "",
            answerText: typeof t.geminiResponse === 'string'
              ? t.geminiResponse
              : JSON.stringify(t.geminiResponse), // store as stringified JSON if object
          },
        });
      }

      return {
        end: true,
        message: geminiResponse.isCorrect
          ? "Correct! You win!"
          : "Game over. You lose.",
        geminiResponse: geminiResponse.newHint,
      };
    }

    this.turn += 1;

    return { end: false, geminiResponse: geminiResponse.newHint };
  }
}

module.exports = GameEngine;
