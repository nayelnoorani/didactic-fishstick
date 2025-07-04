import React from "react";

function StartGameButton({ setGameId, setCurrentHint, setGameEnded, setFinalMessage }) {
    const startGame = async () => {
        try {
            const response = await fetch('/api/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            console.log("Start Game Response:", data);

            setGameId(data.gameId);
            setCurrentHint(data.initialHint);
            setGameEnded(false);
            setFinalMessage('');

            console.log("Hint set to:", data.initialHint);

            } catch (err) {
                console.error("Error starting game:", err);
            }
        };

        return (
            <button onClick={startGame}>Start Game</button>
        );
}

export default StartGameButton;
