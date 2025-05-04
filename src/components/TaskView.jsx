import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import NotesView from './NotesView';
import AddNoteForm from './AddNoteForm';

const TaskView = ({ taskId, permission, onClose }) => {
  const [task, setTask] = useState(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`tasks/${taskId}/`); 
        setTask(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (err) {
        setError("Task not found or you don't have permission to view it");
        setLoading(false);
      }
    };
  
    if (taskId) fetchTask();
  }, [taskId]);

  const handleAddNoteSuccess = () => {
    setShowAddNote(false);
    setRefreshNotes(prev => prev + 1);
  };

  if (!taskId) return <div>No task selected</div>;
  if (loading) return <div>Loading task details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <button
        className='btn btn-outline-primary mb-3'
        onClick={onClose}
      >
        <i className="bi bi-arrow-left"></i> Back to Collection
      </button>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="mt-0">{task.title}</h2>
        <div className="mb-3">
          <strong>Owner:</strong>{' '}
          <span className="text-purple">
            {task.owner}
          </span>
        </div>
        <div className="mb-3">
          <strong>Status:</strong>{' '}
          <span
            className={`fw-bold ${task.completed ? 'text-success' : 'text-warning'}`}
          >
            {task.completed ? 'Completed' : 'Pending'}
          </span>
        </div>

        {task.description && (
          <div className="mb-3">
            <strong>Description:</strong>
            <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
              {task.description}
            </p>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title h5 mb-3">Task Details</h4>
            <div className="row">
              {task.due_date && (
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <i className="bi bi-calendar-event me-2 text-primary"></i>
                    <span className="fw-semibold">Due Date</span>
                  </div>
                  <div className="ps-4">
                    {new Date(task.due_date).toLocaleDateString()}
                    {task.due_time && (
                      <span className="text-secondary">
                        {` at ${new Date(task.due_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-flag me-2 text-primary"></i>
                  <span className="fw-semibold">Priority</span>
                </div>
                <div className="ps-4">
                  {task.priority || 'Normal'}
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-clock-history me-2 text-primary"></i>
                  <span className="fw-semibold">Created</span>
                </div>
                <div className="ps-4">
                  {new Date(task.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {(!showAddNote && permission === "edit") && (
            <button
              onClick={() => setShowAddNote(true)}
              className="btn btn-outline-primary"
            >
              + Add Note
            </button>
          )}
          
          {showAddNote && (
            <AddNoteForm 
              taskId={taskId}
              onSuccess={handleAddNoteSuccess}
              onCancel={() => setShowAddNote(false)}
            />
          )}
        </div>

        <NotesView 
          taskId={taskId}
          refreshDependency={refreshNotes}
          permission={permission}
        />
      </div>
    </div>
  );
};

export default TaskView;