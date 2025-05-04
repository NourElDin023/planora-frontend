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
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-5">
      <h3 className="text-primary mb-3">Notes</h3>
      
      {/* Confirmation Dialog */}
      {deletingNoteId && (
        <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1000 }}>
          <div className="bg-white p-4 rounded shadow text-center">
            <p>Are you sure you want to delete this note?</p>
            <div className="d-flex gap-3 justify-content-center mt-4">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteNote(deletingNoteId)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeletingNoteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-muted fst-italic">No notes yet</p>
      ) : (
        <div className="d-grid gap-3">
          {notes.map((note) => (
            <div key={note.id} className="card">
              <div className="card-body">
                <h4 className="card-title text-primary fs-5 mb-2">{note.title}</h4>
                <p className="card-text mb-3" style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                <div className="d-flex justify-content-between align-items-center text-muted small">
                  <div className="d-flex flex-column gap-1">
                    <span className="small">
                      Created: {new Date(note.created_at).toLocaleString()}
                    </span>
                    {note.user && (
                      <span className="small text-secondary">
                        Created by: {note.user.username || note.user}
                      </span>
                    )}
                  </div>
                  {permission === 'edit' && (
                    <button
                      onClick={() => setDeletingNoteId(note.id)}
                      className="btn btn-sm btn-outline-danger"
                      aria-label="Delete note"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesView;