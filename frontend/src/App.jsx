import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import './App.scss';
import Kanban from './components/kanban';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import CreateTaskModal from './components/CreateTaskModal';
import ViewEditTaskModal from './components/ViewEditTaskModal';
import tasksData from './tasks.json';

const user = {
    firstName: 'John',
    lastName: 'Doe'
};

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [data, setData] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [selectedSection, setSelectedSection] = useState('section-1');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        setData(tasksData);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const handleCreateTask = () => {
        const newTask = {
            id: `task-${Date.now()}`,
            title: newTaskTitle,
            description: newTaskDescription
        };

        const updatedData = data.map(section => {
            if (section.id === selectedSection) {
                return {
                    ...section,
                    tasks: [...section.tasks, newTask]
                };
            }
            return section;
        });

        setData(updatedData);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setIsCreateModalOpen(false);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsViewEditModalOpen(true);
    };

    const handleSaveTask = () => {
        const updatedData = data.map(section => {
            return {
                ...section,
                tasks: section.tasks.map(task => {
                    if (task.id === selectedTask.id) {
                        return selectedTask;
                    }
                    return task;
                })
            };
        });

        setData(updatedData);
        setIsViewEditModalOpen(false);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    return (
        <div style={{ padding: '50px' }}>
            {!isDrawerOpen && (
                <button className="burger-menu" onClick={toggleDrawer}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            )}
            <Sidebar 
                isOpen={isDrawerOpen} 
                toggleDrawer={toggleDrawer} 
                toggleMode={toggleMode} 
                isDarkMode={isDarkMode} 
                user={user} 
            />
            <h1 style={{ marginBottom: '20px' }}>
                Kanban UI
            </h1>
            <button 
                className="create-task-button" 
                onClick={() => setIsCreateModalOpen(true)}
            >
                <FontAwesomeIcon icon={faPlus} /> Create Task
            </button>
            <Kanban data={data} setData={setData} onTaskClick={handleTaskClick} />
            {isCreateModalOpen && (
                <CreateTaskModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onCreate={handleCreateTask}
                    newTaskTitle={newTaskTitle}
                    setNewTaskTitle={setNewTaskTitle}
                    newTaskDescription={newTaskDescription}
                    setNewTaskDescription={setNewTaskDescription}
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                    sections={data}
                />
            )}
            {isViewEditModalOpen && selectedTask && (
                <ViewEditTaskModal 
                    onClose={() => setIsViewEditModalOpen(false)} 
                    onSave={handleSaveTask}
                    task={selectedTask}
                    setTask={setSelectedTask}
                />
            )}
        </div>
    );
}

export default App;
