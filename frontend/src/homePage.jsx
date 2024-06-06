import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import './App.scss';
import Kanban from './components/kanban';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import CreateTaskModal from './components/CreateTaskModal';
import ViewEditTaskModal from './components/ViewEditTaskModal';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import {useNavigate} from 'react-router-dom';

const user = {
    firstName: 'John',
    lastName: 'Doe'
};

function App() {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedSection, setSelectedSection] = useState('1');
  const [newDueDate, setNewDueDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
      fetchAuthSession().then(response => {
          const accessToken = response.tokens.accessToken;
          
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/Task`,
          {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`
          }
          })
          .then(response => {
              if(!response.ok)
                  throw new Error("Error");

              return response.json();
          })
          .then(data => setData(data))
          .catch(error => console.log(error));
          });  
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
      // const newTask = {
      //     id: `task-${Date.now()}`,
      //     title: newTaskTitle,
      //     description: newTaskDescription
      // };

      // const updatedData = data.map(section => {
      //     if (section.id === selectedSection) {
      //         return {
      //             ...section,
      //             tasks: [...section.tasks, newTask]
      //         };
      //     }
      //     return section;
      // });

      console.log(newTaskTitle);
      // const des = newTaskDescription.slice(3,-4);
      // console.log(des);
      console.log(newDueDate);
      console.log(selectedSection);

      fetchAuthSession().then(response => {
          const accessToken = response.tokens.accessToken;

          fetch(`${import.meta.env.VITE_API_URL}/api/v1/Task`,
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                  title: newTaskTitle,
                  description: newTaskDescription,
                  dateCreated: new Date().toISOString,
                  dueDate: newDueDate,
                  userId: 1,
                  statusId: selectedSection,
                  taskTypeId: 1
              })
          });
      });
      
      //setData(updatedData);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewDueDate(Date.now);
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
                  if (task.taskId === selectedTask.taskId) {
                      return selectedTask;
                  }
                  return task;
              })
          };
      });
      
      fetchAuthSession().then(response => {
          const accessToken = response.tokens.accessToken;

          fetch(`${import.meta.env.VITE_API_URL}/api/v1/Task/${selectedTask.taskId}`,
          {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                  taskId: selectedTask.taskId,
                  title: selectedTask.title,
                  description: selectedTask.description,
                  dateCreated: selectedTask.dateCreated,
                  dueDate: selectedTask.dueDate,
                  userId: selectedTask.userId,
                  statusId: selectedTask.statusId,
                  taskTypeId: selectedTask.taskTypeId
              })
          });
      });
      

      setData(updatedData);
      setIsViewEditModalOpen(false);
  };

  const toggleDrawer = () => {
      setIsDrawerOpen(prevState => !prevState);
  };

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        await getCurrentUser();
      }
      catch(error) {
        navigate("/login");
      }
    }

    isAuthenticated();
  }, [navigate]);

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
                  TodoZen
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
                  newDueDate={newDueDate}
                  setNewDueDate={setNewDueDate}
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
