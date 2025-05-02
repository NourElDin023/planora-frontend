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
        console.log('Collection fetched:', res.data);
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
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-primary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: '2rem',
      color: 'var(--text-primary)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            background: '#7D26CD',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 5px var(--shadow-color)'
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          ← Back to Home
        </button>

        {/* Main Content */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 12px var(--shadow-color)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Collection Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {collection.title}
                </h2>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  borderRadius: '999px',
                  background: 'var(--badge-bg)',
                  color: 'var(--badge-text)'
                }}>
                  {collection.shareable_permission} access
                </span>
              </div>
              
              {collection.description && (
                <p style={{
                  marginTop: '0.5rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5'
                }}>
                  {collection.description}
                </p>
              )}
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                margin: '1rem 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Owner: {collection.owner}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                {!isAdded ? (
                  <button
                    onClick={handleAddToShared}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      backgroundColor: loading ? 'var(--button-disabled)' : '#7D26CD',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 2px 5px var(--shadow-color)'
                    }}
                    onMouseOver={e => !loading && (e.currentTarget.style.opacity = '0.9')}
                    onMouseOut={e => !loading && (e.currentTarget.style.opacity = '1')}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></span>
                        Adding...
                      </>
                    ) : (
                      'Add to My Shared Collections'
                    )}
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--success)',
                    fontWeight: '500'
                  }}>
                    ✓ Added to your shared collections!
                  </div>
                )}
                
                {error && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--error)',
                    marginTop: '0.5rem'
                  }}>
                    {error}
                  </div>
                )}
              </div>
            </div>
            
            {/* Task Manager */}
            {!selectedTask && (
              <div style={{ width: '100%' }}>
                <TaskManager
                  collectionId={collection.id}
                  permission={collection.shareable_permission}
                  onTaskSelect={setSelectedTask}
                />
              </div>
            )}
          </div>

          {/* Task View */}
          {selectedTask && (
            <div style={{
              marginTop: '2rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.5rem'
            }}>
              <TaskView
                taskId={selectedTask.id}
                permission={collection.shareable_permission}
                onClose={() => setSelectedTask(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Simple spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PublicSharedPage;