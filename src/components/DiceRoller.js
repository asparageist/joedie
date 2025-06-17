import React from 'react';
import Die from './Die';
import { UI_TEXT } from '../constants';
import { calculateDiceTotal } from '../utils/diceUtils';

/**
 * DiceRoller Component - Main game interface with dice and controls
 * @param {Array} dice - Array of die objects
 * @param {Array} displayValues - Current display values for each die
 * @param {Array} selectedDice - Indices of selected dice
 * @param {Array} rollingDice - Indices of currently rolling dice
 * @param {boolean} isRolling - Whether any dice are rolling
 * @param {Function} onFaceChange - Callback for die face change
 * @param {Function} onToggleSelection - Callback for die selection toggle
 * @param {Function} onRoll - Callback for roll action
 * @param {Function} onReset - Callback for reset action
 */
const DiceRoller = ({
  dice,
  displayValues,
  selectedDice,
  rollingDice,
  isRolling,
  onFaceChange,
  onToggleSelection,
  onRoll,
  onReset
}) => {
  const total = calculateDiceTotal(selectedDice, displayValues);

  return (
    <div className="dice-container">
      {dice.map((die, index) => (
        <Die
          key={index}
          die={die}
          index={index}
          displayValue={displayValues[index]}
          isSelected={selectedDice.includes(index)}
          isRolling={rollingDice.includes(index)}
          isDisabled={isRolling}
          onFaceChange={onFaceChange}
          onToggleSelection={onToggleSelection}
        />
      ))}
      
      <div className="controls-container">
        <button 
          onClick={onRoll} 
          className="roll-button"
          disabled={isRolling}
        >
          {isRolling ? UI_TEXT.ROLLING_TEXT : UI_TEXT.ROLL_BONES_BUTTON}
        </button>
        <button 
          onClick={onReset} 
          className="new-dice-button"
          disabled={isRolling}
        >
          {UI_TEXT.NEW_BONES_BUTTON}
        </button>
      </div>
      
      {selectedDice.length > 0 && (
        <div className="total-display">
          {UI_TEXT.TOTAL_LABEL} {total}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;