/**
 * Audio utilities for managing sound effects
 */

/**
 * Plays an audio file
 * @param {string} audioSrc - Source path for the audio file
 */
export const playAudio = (audioSrc) => {
  try {
    const audio = new Audio(audioSrc);
    audio.play().catch(console.warn); // Handle autoplay restrictions gracefully
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};