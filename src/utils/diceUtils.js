/**
 * Utility functions for dice operations
 */

/**
 * Generates a random value between 1 and the specified number of faces
 * @param {number} faces - Number of faces on the die
 * @returns {number} Random value between 1 and faces (inclusive)
 */
export const getRandomValue = (faces) => {
  return Math.floor(Math.random() * faces) + 1;
};

/**
 * Creates an array of dice with default values
 * @param {number} count - Number of dice to create
 * @param {number} faces - Number of faces for each die (default: 6)
 * @returns {Array} Array of die objects
 */
export const createDiceArray = (count, faces = 6) => {
  return Array(count).fill().map(() => ({ 
    faces, 
    value: 1 
  }));
};

/**
 * Calculates the total of selected dice values
 * @param {Array} selectedIndices - Indices of selected dice
 * @param {Array} values - Array of die values
 * @returns {number} Sum of selected dice values
 */
export const calculateDiceTotal = (selectedIndices, values) => {
  return selectedIndices.reduce((sum, index) => sum + values[index], 0);
};

/**
 * Toggles die selection state
 * @param {Array} currentSelection - Current array of selected indices
 * @param {number} index - Index to toggle
 * @returns {Array} New selection array
 */
export const toggleSelection = (currentSelection, index) => {
  if (currentSelection.includes(index)) {
    return currentSelection.filter(i => i !== index);
  } else {
    return [...currentSelection, index];
  }
};