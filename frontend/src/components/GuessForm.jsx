import React from 'react';

function GuessForm({ gameId, userMessage, setUserMessage, setCurrentHint, setGameEnded, setFinalMessage }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userMessage.length > 200) {
      alert("Please keep guesses under 200 characters.");
      return;
    }

    try {
      const response = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, userMessage }),
      });
      const data = await response.json();

      if (data.end) {
        setGameEnded(true);
        setFinalMessage(data.message);
      } else {
        setCurrentHint(data.geminiResponse);
      }

      setUserMessage('');
    } catch (err) {
      console.error("Error submitting guess:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        maxLength={200}
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Enter your guess or question"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default GuessForm;
