import React from 'react';
import { DICE_TYPES } from '../constants';

/**
 * Die Component - Individual die with face selector and value display
 * @param {Object} die - Die object with faces and value
 * @param {number} index - Index of the die
 * @param {number} displayValue - Current display value of the die
 * @param {boolean} isSelected - Whether the die is selected
 * @param {boolean} isRolling - Whether the die is currently rolling
 * @param {boolean} isDisabled - Whether interactions are disabled
 * @param {Function} onFaceChange - Callback for face count change
 * @param {Function} onToggleSelection - Callback for selection toggle
 */
const Die = ({
  die,
  index,
  displayValue,
  isSelected,
  isRolling,
  isDisabled,
  onFaceChange,
  onToggleSelection
}) => {
  const handleFaceChange = (e) => {
    onFaceChange(index, e.target.value);
  };

  const handleClick = () => {
    if (!isDisabled) {
      onToggleSelection(index);
    }
  };

  const handleSelectClick = (e) => {
    e.stopPropagation();
  };

  const className = [
    'die',
    isRolling ? 'rolling' : '',
    isSelected ? 'selected' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      onClick={handleClick}
      data-faces={die.faces}
    >
      <select
        value={die.faces}
        onChange={handleFaceChange}
        disabled={isDisabled}
        onClick={handleSelectClick}
      >
        {DICE_TYPES.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <div className="die-value">{displayValue}</div>
    </div>
  );
};

export default Die;