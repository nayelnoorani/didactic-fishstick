const GameEngine = require('../src/gameEngine');

// Mock geminiClient functions
jest.mock('../src/geminiClient', () => ({
  generateCharacter: jest.fn(() => Promise.resolve('Sherlock Holmes')),
  evaluateGuess: jest.fn((character, userGuess) => {
    if (userGuess.toLowerCase().includes('sherlock holmes')) {
      return Promise.resolve({
        userGuess: 'Sherlock Holmes',
        isCorrect: true,
        newHint: 'Correct! It is Sherlock Holmes.'
      });
    }
    return Promise.resolve({
      userGuess,
      isCorrect: false,
      newHint: 'Here is a hint about the character...'
    });
  }),
}));

describe('GameEngine functionality', () => {
  let game;

  beforeAll(() => {
    game = new GameEngine();
  });

  test('initializes with correct default values', () => {
    expect(game.gameId).toBe(null);
    expect(game.character).toBe(null);
    expect(game.initialHint).toBe(null);
    expect(game.finalOutcome).toBe(null);
    expect(game.turn).toBe(1);
    expect(game.turns).toEqual([]);
  });

  test('starts a new game and sets character and initial hint', async () => {
    const hint = await game.startNewGame();

    expect(game.character).toBe('Sherlock Holmes');
    expect(typeof hint).toBe('string');
    expect(hint.length).toBeGreaterThan(0);

    expect(game.turns.length).toBe(1); // turn 0 recorded
    expect(game.turns[0].geminiResponse).toBe(hint);
  });

  test('playTurn updates turn data correctly', async () => {
    const prevTurn = game.turn;
    const result = await game.playTurn('Is it Sherlock Holmes?');

    if (result.end) {
      // If game ends, turn does not increment
      expect(game.turn).toBe(prevTurn);
      expect(result.message).toBe('Correct! You win!');
    } else {
      // If game continues, turn increments
      expect(game.turn).toBe(prevTurn + 1);
    }

    expect(game.turns.length).toBeGreaterThan(1);

    const lastTurn = game.turns[game.turns.length - 1];
    expect(lastTurn.userMessage).toBe('Is it Sherlock Holmes?');
    expect(typeof lastTurn.geminiResponse).toBe('string');
  });
});
