import { useState, useCallback } from 'react';
import { createDiceArray, getRandomValue, toggleSelection } from '../utils/diceUtils';
import { playAudio } from '../utils/audioUtils';
import { ANIMATION_CONFIG, DEFAULT_DIE_VALUE } from '../constants';
import rollSound from '../sfx/roll.wav';
import stopSound from '../sfx/stop.wav';

/**
 * Custom hook for managing dice game state and logic
 */
export const useDiceGame = () => {
  const [dice, setDice] = useState([]);
  const [displayValues, setDisplayValues] = useState([]);
  const [selectedDice, setSelectedDice] = useState([]);
  const [rollingDice, setRollingDice] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  /**
   * Initializes dice for the game
   * @param {number} count - Number of dice to create
   */
  const initializeDice = useCallback((count) => {
    const newDice = createDiceArray(count);
    setDice(newDice);
    setDisplayValues(Array(count).fill(DEFAULT_DIE_VALUE));
    setSelectedDice([]);
    setRollingDice([]);
  }, []);

  /**
   * Updates the face count for a specific die
   * @param {number} index - Die index
   * @param {string} faces - New face count
   */
  const handleFaceChange = useCallback((index, faces) => {
    setDice(prevDice => {
      const newDice = [...prevDice];
      newDice[index].faces = parseInt(faces);
      return newDice;
    });
  }, []);

  /**
   * Toggles selection state of a die
   * @param {number} index - Die index
   */
  const handleToggleSelection = useCallback((index) => {
    if (isRolling) return;
    
    setSelectedDice(prevSelected => 
      toggleSelection(prevSelected, index)
    );
  }, [isRolling]);

  /**
   * Animates a single die rolling
   * @param {number} index - Die index
   * @param {number} finalValue - Final value to settle on
   * @param {Function} onComplete - Callback when animation completes
   */
  const animateDie = useCallback((index, finalValue, onComplete) => {
    setRollingDice(prev => [...prev, index]);
    
    let animationFrame = 0;
    const animate = () => {
      if (animationFrame < ANIMATION_CONFIG.ANIMATION_FRAMES) {
        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = getRandomValue(dice[index].faces);
          return newValues;
        });
        animationFrame++;
        setTimeout(animate, ANIMATION_CONFIG.FRAME_DURATION_MS);
      } else {
        // Animation complete - set final value
        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = finalValue;
          return newValues;
        });
        setRollingDice(prev => prev.filter(i => i !== index));
        playAudio(stopSound);
        onComplete();
      }
    };
    animate();
  }, [dice]);

  /**
   * Rolls all unselected dice with staggered animation
   */
  const rollDice = useCallback(() => {
    setIsRolling(true);
    setRollingDice([]);
    playAudio(rollSound);

    // Calculate new values for all dice
    const newDice = dice.map((die, index) => ({
      ...die,
      value: selectedDice.includes(index) ? die.value : getRandomValue(die.faces)
    }));

    // Get indices of dice that will actually roll
    const rollingIndices = dice
      .map((_, index) => index)
      .filter(index => !selectedDice.includes(index));

    if (rollingIndices.length === 0) {
      // No dice to roll
      setDice(newDice);
      setIsRolling(false);
      return;
    }

    let completedRolls = 0;

    // Start each die animation with staggered timing
    rollingIndices.forEach((index, rollIndex) => {
      const delay = rollIndex * ANIMATION_CONFIG.ROLL_DELAY_MS;
      
      setTimeout(() => {
        animateDie(index, newDice[index].value, () => {
          completedRolls++;
          if (completedRolls === rollingIndices.length) {
            // All animations complete
            setTimeout(() => {
              setDice(newDice);
              setIsRolling(false);
            }, ANIMATION_CONFIG.END_DELAY_MS);
          }
        });
      }, delay);
    });
  }, [dice, selectedDice, animateDie]);

  /**
   * Resets all game state
   */
  const resetGame = useCallback(() => {
    setDice([]);
    setDisplayValues([]);
    setSelectedDice([]);
    setRollingDice([]);
    setIsRolling(false);
  }, []);

  return {
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
  };
};