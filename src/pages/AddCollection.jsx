import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';

const AddCollection = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchCollection = async () => {
        try {
          const res = await axios.get(`collections/${id}/`);
          setTitle(res.data.title);
          setDescription(res.data.description || '');
        } catch (err) {
          console.error('Error fetching collection:', err);
          alert('Failed to load collection');
        }
      };
      fetchCollection();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`collections/${id}/`, { title, description });
      } else {
        await axios.post('collections/', { title, description });
      }
      navigate('/viewcollections');
    } catch (err) {
      console.error('Error saving collection:', err);
      alert(`Failed to ${id ? 'update' : 'create'} collection`);
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
            <i className={`fas ${id ? 'fa-edit' : 'fa-folder-plus'} me-2`}></i>
            {id ? 'Edit Collection' : 'Create New Collection'}
          </h2>
          <button
            className="btn btn-danger"
            onClick={() => navigate('/viewcollections')}
          >
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
                <label htmlFor="description" className="form-label">Description</label>
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
                  {id ? 'Update Collection' : 'Create Collection'}
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