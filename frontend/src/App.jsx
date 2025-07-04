import React, { useState } from 'react';
import StartGameButton from './components/StartGameButton';
import HintDisplay from './components/HintDisplay';
import GuessForm from './components/GuessForm';

function App() {
  const [gameId, setGameId] = useState(null);
  const [currentHint, setCurrentHint] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');

  return (
    <div className="container">
      <h1>20 Questions Game</h1>

      {!gameId && (
        <StartGameButton setGameId={setGameId} setCurrentHint={setCurrentHint} setGameEnded={setGameEnded} setFinalMessage={setFinalMessage} />
      )}

      {gameId && !gameEnded && (
        <>
          <HintDisplay hint={currentHint} />
          <GuessForm
            gameId={gameId}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            setCurrentHint={setCurrentHint}
            setGameEnded={setGameEnded}
            setFinalMessage={setFinalMessage}
          />
        </>
      )}

      {gameEnded && (
        <div>
          <h2>{finalMessage}</h2>
          <button onClick={() => {
            setGameId(null);
            setCurrentHint('');
            setGameEnded(false);
            setFinalMessage('');
            setUserMessage('');
          }}>Start New Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
