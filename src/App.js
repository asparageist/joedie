import React, { useState, useEffect } from 'react';
import './App.css';
import skullSplashSound from './sfx/skullsplash.mp3';
import rollSound from './sfx/roll.mp3';
import stopSound from './sfx/stop.mp3';
import addBonesSound from './sfx/addbones.mp3';
import dieRollSound from './sfx/dieroll.mp3';
import holdSound from './sfx/hold.mp3';
import ixnaySound from './sfx/ixnay.mp3';
import removeSound from './sfx/remove.mp3';

const skullSplat = 'https://i.imgur.com/yUmfJvj.png';
const d4 = 'https://i.imgur.com/XeADQ3n.png';
const d6 = 'https://i.imgur.com/Fp6Gcgd.png';
const d8 = 'https://i.imgur.com/uDMoVFD.png';
const d10 = 'https://i.imgur.com/Mt5tyAp.png';
const d12 = 'https://i.imgur.com/uq3Xzk5.png';
const d20 = 'https://i.imgur.com/aA7h2Sd.png';

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
  const [showButtons, setShowButtons] = useState(false);

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
    playAudio(addBonesSound);
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
    playAudio(dieRollSound);
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
    
    playAudio(holdSound);
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
    setShowButtons(false);
  };

  const removeDie = (index) => {
    if (isRolling) return;
    
    playAudio(removeSound);
    setDice(prevDice => {
      const newDice = prevDice.filter((_, i) => i !== index);
      if (newDice.length === 0) {
        setShowDice(false);
        playAudio(skullSplashSound);
      }
      return newDice;
    });
    setDisplayValues(prevValues => prevValues.filter((_, i) => i !== index));
    setSelectedDice(prevSelected => {
      const filteredSelected = prevSelected.filter(i => i !== index);
      return filteredSelected.map(i => i > index ? i - 1 : i);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {!showDice ? (
          <div className="splash-background" onClick={() => setShowButtons(true)}>
            <img src={skullSplat} alt="Skull Splat" className="splash-image" />
            <div className="content-container">
              <div className="splash-text">Joe diE</div>
              <div className={`die-buttons ${showButtons ? 'fade-in-buttons' : 'hidden-buttons'}`}>
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
                  <button onClick={() => {
                    playAudio(ixnaySound);
                    setSelectedDiceCount({
                      4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0
                    });
                  }} className="die-button action-button">
                    <span>IXNAY</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dice-container landscape-layout">
            <div className="dice-row">
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
            </div>
            <div className="landscape-controls-col">
              <div className="landscape-buttons">
                <div className="controls-container landscape-controls">
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
              </div>
              {selectedDice.length > 0 && (
                <div className="total-display landscape-total">
                  {calculateTotal()}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
