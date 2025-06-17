import React from 'react';
import skullSplat from '../img/skullsplat2.png';
import { UI_TEXT } from '../constants';

/**
 * SplashScreen Component - Initial screen with skull image and dice count input
 * @param {Function} onSubmit - Callback function when form is submitted
 */
const SplashScreen = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(e.target.numDice.value);
    if (num > 0) {
      onSubmit(num);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="splash-container">
        <img src={skullSplat} alt="Skull Splat" className="splash-image" />
        <div className="splash-text">{UI_TEXT.APP_TITLE}</div>
      </div>
      <label>
        {UI_TEXT.BONES_LABEL}
        <input
          type="number"
          name="numDice"
          min="1"
          required
        />
      </label>
      <button type="submit">{UI_TEXT.ROLL_BUTTON}</button>
    </form>
  );
};

export default SplashScreen;