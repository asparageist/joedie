/**
 * Application constants and configuration
 */

// Dice configuration
export const DICE_TYPES = [
  { value: 4, label: 'd4' },
  { value: 6, label: 'd6' },
  { value: 8, label: 'd8' },
  { value: 10, label: 'd10' },
  { value: 12, label: 'd12' },
  { value: 20, label: 'd20' }
];

export const DEFAULT_DIE_FACES = 6;
export const DEFAULT_DIE_VALUE = 1;

// Animation configuration
export const ANIMATION_CONFIG = {
  ROLL_DELAY_MS: 200,
  ANIMATION_FRAMES: 10,
  FRAME_DURATION_MS: 50,
  END_DELAY_MS: 200
};

// UI text
export const UI_TEXT = {
  APP_TITLE: 'Joe diE',
  BONES_LABEL: 'BONES:',
  ROLL_BUTTON: 'ROLL EM',
  ROLL_BONES_BUTTON: 'ROLL BONES',
  NEW_BONES_BUTTON: 'NEW BONES',
  ROLLING_TEXT: 'booga booga booga',
  TOTAL_LABEL: 'Total:'
};