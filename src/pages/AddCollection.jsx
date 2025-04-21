// components/AddCollection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const AddCollection = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('collections/', { title, description });
      navigate('/viewcollections');
    } catch (err) {
      console.error('Error creating collection:', err);
      alert('Failed to create collection');
    }
  };

  return (
    <div className="container-fluid py-4" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh',
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ color: '#6a11cb' }}>
            <i className="fas fa-folder-plus me-2"></i>
            Create New Collection
          </h2>
          <button className="btn btn-danger" onClick={() => navigate('/viewcollections')}>
            <i className="fas fa-times me-1"></i>
            Cancel
          </button>
        </div>

        <div className="card shadow">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label htmlFor="title" className="form-label">Title*</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="description" className="form-label">Description*</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check me-1"></i>
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCollection;
