import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

const NotesView = ({ taskId, permission, refreshDependency }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`notes/?task=${taskId}`);
        setNotes(res.data);
        setLoading(false);
        setError('');
      } catch (err) {
        setError('Failed to load notes');
        setLoading(false);
      }
    };

    if (taskId) fetchNotes();
  }, [taskId, refreshDependency]);

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`notes/${noteId}/`);
      setNotes(notes.filter((note) => note.id !== noteId));
      setDeletingNoteId(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
      setDeletingNoteId(null);
    }
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Notes</h3>
      
      {/* Confirmation Dialog */}
      {deletingNoteId && (
        <div style={styles.confirmationOverlay}>
          <div style={styles.confirmationDialog}>
            <p>Are you sure you want to delete this note?</p>
            <div style={styles.confirmationButtons}>
              <button
                style={styles.confirmButton}
                onClick={() => handleDeleteNote(deletingNoteId)}
              >
                Delete
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => setDeletingNoteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <p style={styles.emptyState}>No notes yet</p>
      ) : (
        <div style={styles.notesGrid}>
          {notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <h4 style={styles.noteTitle}>{note.title}</h4>
              <p style={styles.noteContent}>{note.content}</p>
              <div style={styles.noteFooter}>
                <div style={styles.metaInfo}>
                  <span style={styles.timestamp}>
                    Created: {new Date(note.created_at).toLocaleString()}
                  </span>
                  {note.user && (
                    <span style={styles.author}>
                      Created by: {note.user.username || note.user}
                    </span>
                  )}
                </div>
                {permission === 'edit' && (
                  <button
                    onClick={() => setDeletingNoteId(note.id)}
                    style={styles.deleteButton}
                    aria-label="Delete note"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '2rem',
  },
  heading: {
    color: '#7D26CD',
    marginBottom: '1rem',
  },
  emptyState: {
    color: '#666',
    fontStyle: 'italic',
  },
  notesGrid: {
    display: 'grid',
    gap: '1rem',
  },
  noteCard: {
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '6px',
    position: 'relative',
    backgroundColor: '#fff',
  },
  noteTitle: {
    marginTop: 0,
    color: '#7D26CD',
    fontSize: '1.1rem',
  },
  noteContent: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  noteFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#666',
    fontSize: '0.9em',
  },
  metaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  timestamp: {
    fontSize: '0.8em',
  },
  author: {
    fontSize: '0.8em',
    color: '#888',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#ff4444',
    cursor: 'pointer',
    padding: '4px',
    fontWeight: '500',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.8,
    },
  },
  errorMessage: {
    color: '#ff4444',
    padding: '1rem',
    backgroundColor: '#ffe6e6',
    borderRadius: '4px',
  },
  confirmationOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationDialog: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  confirmationButtons: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  confirmButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.8,
    },
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.8,
    },
  },
};

export default NotesView;