import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './toggleButton.scss';

const ToggleButton = ({ toggleMode, isDarkMode }) => {
    return (
        <div className="toggle-button" onClick={toggleMode}>
            {isDarkMode ? (
                <FontAwesomeIcon icon={faSun} />
            ) : (
                <FontAwesomeIcon icon={faMoon} />
            )}
        </div>
    );
};

export default ToggleButton;
