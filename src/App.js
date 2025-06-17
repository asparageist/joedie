/**
 * Main App component that manages the overall application state and renders
 * either the splash screen or the dice game interface.
 */
import React, { useState, useEffect } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import DiceRoller from './components/DiceRoller';
import { useDiceGame } from './hooks/useDiceRoller';
import { playAudio } from './utils/audioUtils';
import skullSplashSound from './sfx/skullsplash.wav';

function App() {
  const [showDice, setShowDice] = useState(false);
  
  // Custom hook for all dice-related state and logic
  const {
    dice,
    displayValues,
    selectedDice,
    rollingDice,
    isRolling,
    initializeDice,
    handleFaceChange,
    handleToggleSelection,
    rollDice,
    resetGame
  } = useDiceGame();

  // Play splash sound on app load
  useEffect(() => {
    playAudio(skullSplashSound);
  }, []);

  /**
   * Handles submission from splash screen to start dice game
   * @param {number} numDice - Number of dice to create
   */
  const handleStartGame = (numDice) => {
    initializeDice(numDice);
    setShowDice(true);
  };

  /**
   * Handles reset action - returns to splash screen
   */
  const handleReset = () => {
    resetGame();
    setShowDice(false);
    playAudio(skullSplashSound);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!showDice ? (
          <SplashScreen onSubmit={handleStartGame} />
        ) : (
          <DiceRoller
            dice={dice}
            displayValues={displayValues}
            selectedDice={selectedDice}
            rollingDice={rollingDice}
            isRolling={isRolling}
            onFaceChange={handleFaceChange}
            onToggleSelection={handleToggleSelection}
            onRoll={rollDice}
            onReset={handleReset}
          />
        )}
      </header>
    </div>
  );
}

export default App;
