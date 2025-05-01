import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import MarkdownEditor from '../components/MarkdownEditor';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get('notes/');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNote = async (title, content) => {
    try {
      await axiosInstance.post('notes/', { title, content });
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axiosInstance.delete(`notes/${id}/`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    const cachedNotes = localStorage.getItem('notes');
    if (cachedNotes) {
      setNotes(JSON.parse(cachedNotes));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <div className="container py-5">
        {/* Beautiful Editor */}
        <MarkdownEditor onSave={saveNote} />
        
        {/* Notes List */}
        <div className="row mt-5">
          <div className="col-12">
            <h2 className="text-center mb-4 fw-bold" style={{ color: '#0d6efd' }}>
              <i className="fas fa-book-open me-2"></i>
              Your Notes
            </h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-book fa-3x mb-3" style={{ color: '#0d6efd' }}></i>
                <p className="h4 text-muted">No notes yet. Create your first one above!</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {notes.map((note) => (
                  <div key={note.id} className="col">
                    <div className="card h-100 border-0 shadow-sm">
                      <div 
                        className="card-header py-3" 
                        style={{ background: 'linear-gradient(135deg, rgba(106,17,203,0.1) 0%, rgba(37,117,252,0.1) 100%)' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <h3 className="h5 mb-0 fw-bold" style={{ color: '#0d6efd' }}>
                            {note.title || 'Untitled Note'}
                          </h3>
                          <button 
                            onClick={() => deleteNote(note.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="prose" style={{ color: '#495057' }}>
                          <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>
                      </div>
                      <div className="card-footer bg-transparent border-0 text-end">
                        <small className="text-muted">
                          Created: {new Date(note.created_at).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;