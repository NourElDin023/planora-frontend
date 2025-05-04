import React, { useState } from 'react';
import axios from '../utils/axios';

const AddNoteForm = ({ taskId, onSuccess, onCancel }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!noteTitle.trim()) {
      setError('Please add a title for your note');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await axios.post('notes/', {
        task: taskId,
        title: noteTitle,
        content: noteContent
      });
      
      onSuccess();
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">Add Note</h4>
        
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="noteTitle" className="form-label">Title</label>
            <input
              type="text"
              id="noteTitle"
              className="form-control"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group mb-4">
            <label htmlFor="noteContent" className="form-label">Content</label>
            <textarea
              id="noteContent"
              className="form-control"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter note content"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteForm;