import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
const NotesView = ({ taskId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`notes/?task=${taskId}`);
        setNotes(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load notes');
        setLoading(false);
      }
    };

    if (taskId) fetchNotes();
  }, [taskId]);

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`notes/${noteId}/`);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ color: '#7D26CD' }}>Notes</h3>
      {notes.length === 0 ? (
        <p style={{ color: '#666' }}>No notes yet</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {notes.map(note => (
            <div 
              key={note.id}
              style={{
                padding: '1rem',
                border: '1px solid #eee',
                borderRadius: '6px',
                position: 'relative'
              }}
            >
              <h4 style={{ marginTop: 0, color: '#7D26CD' }}>{note.title}</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#666',
                fontSize: '0.9em'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>
                    Created: {new Date(note.created_at).toLocaleString()}
                  </span>
                  {note.user && (
                    <span style={{ fontSize: '0.8em', color: '#888' }}>
                      Created by: {note.user}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4444',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default NotesView;