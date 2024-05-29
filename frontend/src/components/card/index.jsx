import React, { useState, useEffect, useRef } from 'react';
import './card.scss';

const Card = ({ task, onMoveTask }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const cardRef = useRef(null);

    const handleMoveTask = (newState) => {
        onMoveTask(task.id, newState);
        setShowDropdown(false);
    };

    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowDropdown(!showDropdown);
    };

    const handleClickOutside = (e) => {
        if (cardRef.current && !cardRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className='card' ref={cardRef}>
            <div className='card__content'>
                {task.title}
            </div>
            <div className='card__menu'>
                <button onClick={handleButtonClick}>☰</button>
                {showDropdown && (
                    <div className='card__dropdown'>
                        <div onClick={(e) =>{ e.stopPropagation(); handleMoveTask('section-1');}}>To Do</div>
                        <div onClick={(e) =>{ e.stopPropagation(); handleMoveTask('section-2');}}>In Progress</div>
                        <div onClick={(e) =>{ e.stopPropagation(); handleMoveTask('section-3');}}>Done</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
