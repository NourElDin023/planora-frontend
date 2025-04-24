import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import axios from '../utils/axios';
import TaskManager from '../components/TaskManager';
import TaskView from '../components/TaskView';

const PublicSharedPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await axios.get(`collections/token/${token}/`);
        setCollection(res.data);
      } catch (err) {
        console.error('Error fetching collection', err);
        navigate('/not-found');
      }
    };
    fetchCollection();
  }, [token, navigate]);

  const handleAddToShared = async () => {
    setLoading(true);
    try {
      await axios.post(`collections/add-to-shared/${token}/`);
      setIsAdded(true);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          'Please log in to add this collection to your shared collections.'
        );
      } else {
        setError(
          err.response?.data?.error || 'Failed to add to shared collections.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#7D26CD',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
        {collection ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <div   style={{
                
                marginRight: '1rem',
              }}>
                <h2 style={{ margin: 0 }}>{collection.title}</h2>
                {collection.description && (
                  <p
                    style={{
                      marginTop: '4px',
                      color: '#555',
                      fontStyle: 'italic',
                    }}
                  >
                    {collection.description}
                  </p>
                )}
                <p style={{ marginTop: '4px', color: '#777' }}>
                  Shared with: {collection.shareable_permission} access
                </p>
                <div style={{ marginTop: '1rem' }}>
                  {!isAdded ? (
                    <button
                      onClick={handleAddToShared}
                      disabled={loading}
                      style={{
                        backgroundColor: '#7D26CD',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {loading ? 'Adding...' : 'Add to My Shared Collections'}
                    </button>
                  ) : (
                    <p style={{ color: 'green' }}>
                      ✓ Added to your shared collections!
                    </p>
                  )}
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
              </div>
              {!selectedTask && (
                <TaskManager
                  collectionId={collection.id}
                  permission={collection.shareable_permission}
                  onTaskSelect={setSelectedTask}
                />
              )}
            </div>

            {selectedTask ? (
              <TaskView
                taskId={selectedTask.id}
                permission={collection.shareable_permission}
                onClose={() => setSelectedTask(null)}
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <p>Select a shared collection to view its tasks.</p>
        )}
      </div>
    </div>
  );
};

export default PublicSharedPage;
