import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './modal.scss';

const ViewEditTaskModal = ({ onClose, onSave, task, setTask }) => {
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
                <h2>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                    />
                </h2>
                <div className="quill-wrapper">
                    <ReactQuill
                        value={task.description}
                        onChange={(value) => setTask({ ...task, description: value })}
                        modules={modules}
                    />
                </div>
                <button id="save" onClick={onSave}>Save</button>
                <button id="cancel" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default ViewEditTaskModal;
