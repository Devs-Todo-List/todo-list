import React from 'react';
import './modal.scss';

const Modal = ({ onClose, onCreate, newTaskTitle, setNewTaskTitle, selectedSection, setSelectedSection, sections }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Create New Task</h2>
                <input 
                    type="text" 
                    placeholder="Task Title" 
                    value={newTaskTitle} 
                    onChange={(e) => setNewTaskTitle(e.target.value)} 
                />
                <select 
                    value={selectedSection} 
                    onChange={(e) => setSelectedSection(e.target.value)}
                >
                    {sections.map(section => (
                        <option key={section.id} value={section.id}>
                            {section.title}
                        </option>
                    ))}
                </select>
                <button onClick={onCreate}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default Modal;
