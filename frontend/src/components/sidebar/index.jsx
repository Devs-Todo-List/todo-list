import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import ToggleButton from '../toggleButton';
import { useNavigate } from 'react-router-dom';
import './sidebar.scss';

const Sidebar = ({ isOpen, toggleDrawer, toggleMode, isDarkMode, user }) => {
    const sidebarRef = useRef(null);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            toggleDrawer();
        }
    };
    const navigate = useNavigate();

    const handleLogout = () => {
      sessionStorage.clear();
      navigate('/login');
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={sidebarRef} className={`drawer ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Sidebar">
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
                    <button className="logout-btn" aria-label="Logout" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                </>
            )}
        </div>
    );
};

export default Sidebar;
