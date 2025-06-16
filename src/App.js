import React, { useState, useEffect } from 'react';
import './App.css';
import skullSplat from './img/skullsplat2.png';
import skullSplashSound from './sfx/skullsplash.mp3';
import rollSound from './sfx/roll.mp3';
import stopSound from './sfx/stop.mp3';
import d4 from './img/d4.png';
import d6 from './img/d6.png';
import d8 from './img/d8.png';
import d10 from './img/d10.png';
import d12 from './img/d12.png';
import d20 from './img/d20.png';

function App() {
  const [dice, setDice] = useState([]);
  const [showDice, setShowDice] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [displayValues, setDisplayValues] = useState([]);
  const [selectedDice, setSelectedDice] = useState([]);
  const [rollingDice, setRollingDice] = useState([]);
  const [selectedDiceCount, setSelectedDiceCount] = useState({
    4: 0,
    6: 0,
    8: 0,
    10: 0,
    12: 0,
    20: 0
  });

  const playAudio = (audioFile) => {
    try {
      const audio = new Audio(audioFile);
      audio.play().catch(error => {
        console.warn('Audio playback failed:', error);
      });
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  };

  useEffect(() => {
    playAudio(skullSplashSound);
  }, []);

  const handleDieSelect = (faces) => {
    setSelectedDiceCount(prev => ({
      ...prev,
      [faces]: prev[faces] + 1
    }));
  };

  const handleDieRemove = (faces) => {
    setSelectedDiceCount(prev => ({
      ...prev,
      [faces]: Math.max(0, prev[faces] - 1)
    }));
  };

  const startRolling = () => {
    const newDice = [];
    Object.entries(selectedDiceCount).forEach(([faces, count]) => {
      for (let i = 0; i < count; i++) {
        newDice.push({
          faces: parseInt(faces),
          value: getRandomValue(parseInt(faces))
        });
      }
    });

    if (newDice.length > 0) {
      setDice(newDice);
      setDisplayValues(Array(newDice.length).fill(1));
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
    if (isRolling) return;
    
    setIsRolling(true);
    setRollingDice([]);
    playAudio(rollSound);

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
    setDice([]);
    setDisplayValues([]);
    setSelectedDice([]);
    setRollingDice([]);
    setShowDice(false);
    setSelectedDiceCount({
      4: 0,
      6: 0,
      8: 0,
      10: 0,
      12: 0,
      20: 0
    });
    playAudio(skullSplashSound);
  };

  const removeDie = (index) => {
    if (isRolling) return;
    
    setDice(prevDice => {
      const newDice = prevDice.filter((_, i) => i !== index);
      if (newDice.length === 0) {
        setShowDice(false);
        playAudio(skullSplashSound);
      }
      return newDice;
    });
    setDisplayValues(prevValues => prevValues.filter((_, i) => i !== index));
    setSelectedDice(prevSelected => prevSelected.filter(i => i !== index));
  };

  return (
    <div className="App">
      <header className="App-header">
        {!showDice ? (
          <div className="splash-background">
            <img src={skullSplat} alt="Skull Splat" className="splash-image" />
            <div className="content-container">
              <div className="splash-text">Joe diE</div>
              <div className="die-buttons">
                <div className="dice-grid">
                  <button onClick={() => handleDieSelect(4)} className="die-button">
                    <span>d4</span>
                    <img src={d4} alt="d4" />
                    <span>{selectedDiceCount[4]}</span>
                  </button>
                  <button onClick={() => handleDieSelect(6)} className="die-button">
                    <span>d6</span>
                    <img src={d6} alt="d6" />
                    <span>{selectedDiceCount[6]}</span>
                  </button>
                  <button onClick={() => handleDieSelect(8)} className="die-button">
                    <span>d8</span>
                    <img src={d8} alt="d8" />
                    <span>{selectedDiceCount[8]}</span>
                  </button>
                  <button onClick={() => handleDieSelect(10)} className="die-button">
                    <span>d10</span>
                    <img src={d10} alt="d10" />
                    <span>{selectedDiceCount[10]}</span>
                  </button>
                  <button onClick={() => handleDieSelect(12)} className="die-button">
                    <span>d12</span>
                    <img src={d12} alt="d12" />
                    <span>{selectedDiceCount[12]}</span>
                  </button>
                  <button onClick={() => handleDieSelect(20)} className="die-button">
                    <span>d20</span>
                    <img src={d20} alt="d20" />
                    <span>{selectedDiceCount[20]}</span>
                  </button>
                </div>
                <div className="action-buttons">
                  <button onClick={startRolling} className="die-button action-button">
                    <span>ROLL EM</span>
                  </button>
                  <button onClick={() => setSelectedDiceCount({
                    4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0
                  })} className="die-button action-button">
                    <span>IXNAY</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dice-container">
            {dice.map((die, index) => (
              <div
                key={index}
                className={`die ${rollingDice.includes(index) ? 'rolling' : ''} ${selectedDice.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleDieSelection(index)}
                data-faces={die.faces}
              >
                <button 
                  className="remove-die"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDie(index);
                  }}
                  disabled={isRolling}
                >
                  ×
                </button>
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
