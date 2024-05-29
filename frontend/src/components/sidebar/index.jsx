import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import ToggleButton from '../toggleButton';
import './sidebar.scss';

const Sidebar = ({ isOpen, toggleDrawer, toggleMode, isDarkMode, user }) => {
    return (
        <div className={`drawer ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Sidebar">
            {isOpen && (
                <>
                    <button className="menu-btn" onClick={toggleDrawer} aria-label="Close sidebar">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <ToggleButton toggleMode={toggleMode} isDarkMode={isDarkMode} />
                    <div className="user-info">
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                        <div className="user-name">
                            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                        </div>
                    </div>
                    <button className="logout-btn" aria-label="Logout">
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </>
            )}
        </div>
    );
};

export default Sidebar;
