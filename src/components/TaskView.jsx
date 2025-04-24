import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import NotesView from './NotesView';
import AddNoteForm from './AddNoteForm';

const TaskView = ({ taskId,permission , onClose }) => {
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
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onClose}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          background: '#7D26CD',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        &larr; Back to List
      </button>

      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{task.title}</h2>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Status:</strong>{' '}
          <span
            style={{
              color: task.completed ? '#4CAF50' : '#ff9800',
              fontWeight: 'bold',
            }}
          >
            {task.completed ? 'Completed' : 'Pending'}
          </span>
        </div>

        {task.description && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Description:</strong>
            <p style={{ whiteSpace: 'pre-wrap', margin: '0.5rem 0 0' }}>
              {task.description}
            </p>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {task.due_date && (
            <div>
              <strong>Due Date:</strong>
              <p style={{ margin: '0.5rem 0 0' }}>
                {new Date(task.due_date).toLocaleDateString()}
                {task.due_time &&
                  ` at ${new Date(task.due_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
              </p>
            </div>
          )}

          <div>
            <strong>Priority:</strong>
            <p style={{ margin: '0.5rem 0 0' }}>{task.priority || 'Normal'}</p>
          </div>

          <div>
            <strong>Created:</strong>
            <p style={{ margin: '0.5rem 0 0' }}>
              {new Date(task.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {(!showAddNote && permission ==="edit")&& (
            <button
              onClick={() => setShowAddNote(true)}
              style={{
                background: '#7D26CD',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                ':hover': {
                  backgroundColor: '#6a1fb5'
                }
              }}
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