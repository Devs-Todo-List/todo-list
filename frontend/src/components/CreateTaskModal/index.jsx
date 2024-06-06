import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './modal.scss';

const CreateTaskModal = ({
    onClose,
    onCreate,
    newTaskTitle,
    setNewTaskTitle,
    newTaskDescription,
    setNewTaskDescription,
    selectedSection,
    setSelectedSection,
    newDueDate,
    setNewDueDate,
    sections
}) => {
    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['clean']
        ]
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Task</h2>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="quill-wrapper">
                    <ReactQuill
                        value={newTaskDescription}
                        onChange={setNewTaskDescription}
                        placeholder="Task Description"
                        modules={modules}
                    />
                </div>
                {/* <h5>Due Date</h5>
                <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(new Date(e.target.value).toISOString())}
                /> */}
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                >
                    {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.title}
                        </option>
                    ))}
                </select>
                <button id="create" onClick={onCreate}>Create</button>
                <button id="cancel" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateTaskModal;
