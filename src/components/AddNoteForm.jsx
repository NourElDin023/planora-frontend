import React, { useState } from 'react';
import axios from '../utils/axios';

const AddNoteForm = ({ taskId, onSuccess, onCancel }) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('notes/', { ...newNote, task: taskId });
      onSuccess();
      setNewNote({ title: '', content: '' });
    } catch (err) {
      setError('Failed to create note');
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4 style={{ color: '#7D26CD' }}>Add New Note</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Note title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '0.5rem'
            }}
            required
          />
          <textarea
            placeholder="Note content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '100px'
            }}
            required
          />
        </div>
        {error && <p style={{ color: '#ff4444' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            style={{
              background: '#7D26CD',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            Save Note
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#ddd',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNoteForm;