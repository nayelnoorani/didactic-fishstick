import React from 'react';

function HintDisplay({ hint }) {
    return (
        <div>
            <h3>Hint:</h3>
            <p>{hint}</p>
        </div>
    );
}

export default HintDisplay;