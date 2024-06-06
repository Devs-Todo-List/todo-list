import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useSwipeable } from 'react-swipeable';
import Card from '../card';
import './kanban.scss';
import { fetchAuthSession } from 'aws-amplify/auth';

const Kanban = ({ data, setData, onTaskClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const onDragEnd = result => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data.findIndex(e => e.id === source.droppableId);
            const destinationColIndex = data.findIndex(e => e.id === destination.droppableId);

            const sourceCol = data[sourceColIndex];
            const destinationCol = data[destinationColIndex];

            const sourceTask = [...sourceCol.tasks];
            const destinationTask = [...destinationCol.tasks];

            const [removed] = sourceTask.splice(source.index, 1);
            destinationTask.splice(destination.index, 0, removed);

            const updatedData = [...data];
            updatedData[sourceColIndex] = {
                ...sourceCol,
                tasks: sourceTask
            };
            updatedData[destinationColIndex] = {
                ...destinationCol,
                tasks: destinationTask
            };

            fetchAuthSession().then(response => {
                const accessToken = response.tokens.accessToken;

                fetch(`${import.meta.env.VITE_API_URL}/api/v1/Task/${result.draggableId}`,
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
                .then(data => {
                    fetch(`${import.meta.env.VITE_API_URL}/api/v1/Task/${result.draggableId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                            taskId: data.taskId,
                            title: data.title,
                            description: data.description,
                            dateCreated: data.dateCreated,
                            dueDate: data.dueDate,
                            userId: data.userId,
                            statusId: destinationCol.id,
                            taskTypeId: data.taskTypeId
                        })
                    });
                })
                .catch(error => console.log(error));
            });

            setData(updatedData);
        }
    };

    const handleMoveTask = (taskId, newState) => {
        const sourceColIndex = data.findIndex(col => col.tasks.find(task => task.taskId === taskId));
        if (sourceColIndex === -1) return;

        const sourceCol = data[sourceColIndex];
        const taskIndex = sourceCol.tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex === -1) return;

        const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);

        const destinationColIndex = data.findIndex(col => col.id === newState);
        if (destinationColIndex === -1) return;

        const destinationCol = data[destinationColIndex];
        destinationCol.tasks.push(movedTask);

        const updatedData = [...data];
        updatedData[sourceColIndex] = { ...sourceCol, tasks: sourceCol.tasks };
        updatedData[destinationColIndex] = { ...destinationCol, tasks: destinationCol.tasks };

        setData(updatedData);
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentIndex((currentIndex + 1) % data.length),
        onSwipedRight: () => setCurrentIndex((currentIndex - 1 + data.length) % data.length),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    return (
        <div {...handlers}>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban">
                    {data.map((section, index) => (
                        <Droppable key={section.id} droppableId={section.id}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    className={`kanban__section ${index === currentIndex ? 'active' : ''}`}
                                    ref={provided.innerRef}
                                >
                                    <div className="kanban__section__title">
                                        {section.title}
                                    </div>
                                    <div className="kanban__section__content">
                                        {section.tasks.map((task, taskIndex) => (
                                            <Draggable key={task.taskId} draggableId={task.taskId.toString()} index={taskIndex}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? '0.5' : '1',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => onTaskClick(task)}
                                                    >
                                                        <Card task={task} onMoveTask={handleMoveTask} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            <div className="kanban__pagination">
                {data.map((_, index) => (
                    <span
                        key={index}
                        className={`kanban__pagination__indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Kanban;
