import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

const MarkdownEditor = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (title.trim() === '' || content.trim() === '') {
      alert('Please provide both a title and content!');
      return;
    }
    onSave(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="d-flex justify-content-center min-vh-100 bg-light p-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)' }}>
      <div className="w-100" style={{ maxWidth: '800px' }}>
        {/* Beautiful Purple Card Form */}
        <div className="card border-0 shadow-lg mb-5">
          <div className="card-header bg-gradient-primary text-white py-3" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
            <h2 className="h4 mb-0 text-center">
              <i className="fas fa-edit me-2"></i>
              Create New Note
            </h2>
          </div>
          
          <div className="card-body p-4">
            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="noteTitle" className="form-label fw-bold text-purple">Title</label>
              <input
                id="noteTitle"
                type="text"
                className="form-control form-control-lg border-purple"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a title..."
                style={{ borderColor: '#6a11cb' }}
              />
            </div>

            {/* Content Field */}
            <div className="mb-4">
              <label htmlFor="noteContent" className="form-label fw-bold text-purple">Content</label>
              <textarea
                id="noteContent"
                className="form-control border-purple"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here (Markdown supported)..."
                rows={8}
                style={{ borderColor: '#6a11cb', minHeight: '200px' }}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="btn btn-primary btn-lg w-100 mb-3 fw-bold py-3 text-white"
              style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', border: 'none' }}
            >
              <i className="fas fa-save me-2"></i>
              Save Note
            </button>

            {/* Preview Section */}
            <div className="mt-4 pt-4 border-top">
              <h3 className="h5 mb-3 fw-bold text-purple">
                <i className="fas fa-eye me-2"></i>
                Preview
              </h3>
              <div className="p-3 bg-light rounded border" style={{ minHeight: '100px', borderColor: '#e0c8ff' }}>
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-muted fst-italic mb-0">Your beautiful note preview will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;