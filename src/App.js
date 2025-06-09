import React, { useState, useEffect } from 'react';
import './App.css';
import skullSplat from './img/skullsplat2.png';
import skullSplashSound from './sfx/skullsplash.wav';
import rollSound from './sfx/roll.wav';
import stopSound from './sfx/stop.wav';

function App() {
  const [numDice, setNumDice] = useState(0);
  const [dice, setDice] = useState([]);
  const [showDice, setShowDice] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [displayValues, setDisplayValues] = useState([]);
  const [selectedDice, setSelectedDice] = useState([]);
  const [rollingDice, setRollingDice] = useState([]);

  useEffect(() => {
    const splashAudio = new Audio(skullSplashSound);
    splashAudio.play();
  }, []);

  const handleNumDiceSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(e.target.numDice.value);
    if (num > 0) {
      setNumDice(num);
      setDice(Array(num).fill().map(() => ({ faces: 6, value: 1 })));
      setDisplayValues(Array(num).fill(1));
      setSelectedDice([]);
      setShowDice(true);
    }
  };

  const handleFaceChange = (index, faces) => {
    const newDice = [...dice];
    newDice[index].faces = parseInt(faces);
    setDice(newDice);
  };

  const getRandomValue = (faces) => {
    return Math.floor(Math.random() * faces) + 1;
  };

  const toggleDieSelection = (index) => {
    if (isRolling) return;
    
    setSelectedDice(prevSelected => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter(i => i !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const calculateTotal = () => {
    return selectedDice.reduce((sum, index) => sum + displayValues[index], 0);
  };

  const rollDice = () => {
    setIsRolling(true);
    setRollingDice([]);

    const rollAudio = new Audio(rollSound);
    rollAudio.play();

    const newDice = dice.map((die, index) => ({
      ...die,
      value: selectedDice.includes(index) ? die.value : getRandomValue(die.faces)
    }));

    const rollingDiceCount = dice.filter((_, index) => !selectedDice.includes(index)).length;
    let completedRolls = 0;

    dice.forEach((_, index) => {
      if (selectedDice.includes(index)) return;
      
      const delay = index * 200;
      
      setTimeout(() => {
        setRollingDice(prev => [...prev, index]);
        
        let animationFrame = 0;
        const animate = () => {
          if (animationFrame < 10) {
            setDisplayValues(prev => {
              const newValues = [...prev];
              newValues[index] = getRandomValue(dice[index].faces);
              return newValues;
            });
            animationFrame++;
            setTimeout(animate, 50);
          } else {
            setDisplayValues(prev => {
              const newValues = [...prev];
              newValues[index] = newDice[index].value;
              return newValues;
            });
            setRollingDice(prev => prev.filter(i => i !== index));
            
            const stopAudio = new Audio(stopSound);
            stopAudio.play();
            
            completedRolls++;
            if (completedRolls === rollingDiceCount) {
              setTimeout(() => {
                setDice(newDice);
                setIsRolling(false);
              }, 200);
            }
          }
        };
        animate();
      }, delay);
    });

    if (rollingDiceCount === 0) {
      setDice(newDice);
      setIsRolling(false);
    }
  };

  const resetDice = () => {
    setNumDice(0);
    setDice([]);
    setDisplayValues([]);
    setSelectedDice([]);
    setRollingDice([]);
    setShowDice(false);
    const splashAudio = new Audio(skullSplashSound);
    splashAudio.play();
  };

  return (
    <div className="App">
      <header className="App-header">
        {!showDice ? (
          <form onSubmit={handleNumDiceSubmit}>
            <div className="splash-container">
              <img src={skullSplat} alt="Skull Splat" className="splash-image" />
              <div className="splash-text">Joe diE</div>
            </div>
            <label>
              BONES:
              <input
                type="number"
                name="numDice"
                min="1"
                required
              />
            </label>
            <button type="submit">ROLL EM</button>
          </form>
        ) : (
          <div className="dice-container">
            {dice.map((die, index) => (
              <div
                key={index}
                className={`die ${rollingDice.includes(index) ? 'rolling' : ''} ${selectedDice.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleDieSelection(index)}
                data-faces={die.faces}
              >
                <select
                  value={die.faces}
                  onChange={(e) => handleFaceChange(index, e.target.value)}
                  disabled={isRolling}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="4">d4</option>
                  <option value="6">d6</option>
                  <option value="8">d8</option>
                  <option value="10">d10</option>
                  <option value="12">d12</option>
                  <option value="20">d20</option>
                </select>
                <div className="die-value">{displayValues[index]}</div>
              </div>
            ))}
            <div className="controls-container">
              <button 
                onClick={rollDice} 
                className="roll-button"
                disabled={isRolling}
              >
                {isRolling ? 'booga booga booga' : 'ROLL BONES'}
              </button>
              <button 
                onClick={resetDice} 
                className="new-dice-button"
                disabled={isRolling}
              >
                NEW BONES
              </button>
            </div>
            {selectedDice.length > 0 && (
              <div className="total-display">
                Total: {calculateTotal()}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
