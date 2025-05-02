import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import TaskManager from '../components/TaskManager';
import TaskView from '../components/TaskView';

const SharedCollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const { id, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSharedCollections();
  }, []);

  useEffect(() => {
    if (id || token) {
      const foundCollection = collections.find(c => 
        id ? c.id === parseInt(id) : c.shareable_link_token === token
      );
      if (foundCollection) {
        handleCollectionClick(foundCollection);
      }
    } else if (collections.length > 0) {
      handleCollectionClick(collections[0]);
    }
  }, [collections, id, token]);

  const fetchSharedCollections = async () => {
    try {
      const res = await axios.get('collections/shared-collections/');
      setCollections(res.data);
    } catch (err) {
      console.error('Error fetching shared collections', err);
    }
  };

  const handleCollectionClick = async (collection) => {
    try {
      const res = await axios.get(`collections/${collection.id}/tasks/`);
      setSelectedCollection({
        ...res.data.collection,
        permission: collection.shareable_permission,
        owner: collection.owner,
      });
      setSelectedTask(null);
      navigate(`/collections/${collection.id}/`, { replace: true });
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)'
    }}>
      {/* Modern Sidebar */}
      <div className="sidebar" style={{
        width: '320px',
        padding: '1.5rem',
        borderRight: '1px solid var(--border-color)',
        backgroundColor: 'var(--sidebar-bg)',
        overflowY: 'auto',
        transition: 'all 0.3s ease'
      }}>
        <div className="sidebar-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--heading-color)'
          }}>
            Shared Collections
          </h3>
        </div>

        {/* Collections List */}
        <ul className="collections-list" style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {collections.map((collection) => (
            <li
              key={collection.id}
              className="collection-item"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: selectedCollection?.id === collection.id 
                  ? 'var(--active-bg)' 
                  : 'transparent',
                border: selectedCollection?.id === collection.id
                  ? '1px solid var(--active-border)'
                  : '1px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: 'var(--hover-bg)',
                  borderColor: 'var(--hover-border)'
                }
              }}
              onClick={() => handleCollectionClick(collection)}
            >
              <div style={{ 
                paddingRight: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '500', 
                  marginBottom: '0.25rem',
                  color: 'var(--text-color)'
                }}>
                  {collection.title}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--text-secondary)',
                  marginBottom: '0.25rem'
                }}>
                  Owner: {collection.owner}
                </div>
                {collection.description && (
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {collection.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ 
        flex: 1, 
        padding: '2rem',
        overflowY: 'auto',
        backgroundColor: 'var(--content-bg)'
      }}>
        <Outlet />

        {selectedCollection ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Breadcrumb Navigation */}
            <div
              className="breadcrumb"
              style={{
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem'
              }}
            >
              <button
                onClick={() => {
                  setSelectedCollection(null);
                  setSelectedTask(null);
                  navigate('/shared-collections');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  ':hover': {
                    backgroundColor: 'var(--primary-bg)'
                  }
                }}
              >
                <i className="fas fa-users"></i> Shared Collections
              </button>

              {selectedCollection && (
                <>
                  <i className="fas fa-chevron-right" style={{ 
                    fontSize: '0.7rem', 
                    opacity: 0.6,
                    color: 'var(--text-secondary)'
                  }}></i>
                  {selectedTask ? (
                    <button
                      onClick={() => setSelectedTask(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-color)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        ':hover': {
                          backgroundColor: 'var(--primary-bg)'
                        }
                      }}
                    >
                      {selectedCollection.title}
                    </button>
                  ) : (
                    <span style={{ 
                      color: 'var(--primary-color)',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {selectedCollection.title}
                    </span>
                  )}
                </>
              )}

              {selectedTask && (
                <>
                  <i className="fas fa-chevron-right" style={{ 
                    fontSize: '0.7rem', 
                    opacity: 0.6,
                    color: 'var(--text-secondary)'
                  }}></i>
                  <span style={{ 
                    color: 'var(--primary-color)',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <i className="fas fa-tasks"></i> {selectedTask.title}
                  </span>
                </>
              )}
            </div>

            {/* Collection Content */}
            <div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                gap: '1rem'
              }}>
                <div>
                  <h1 style={{ 
                    fontSize: '1.75rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: 'var(--heading-color)'
                  }}>
                    {selectedCollection.title}
                  </h1>
                  {selectedCollection.description && (
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>
                      {selectedCollection.description}
                    </p>
                  )}
                  <div style={{ 
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <p style={{ 
                      color: 'var(--text-tertiary)',
                      fontSize: '0.85rem',
                      margin: 0
                    }}>
                      <i className="fas fa-user me-1"></i> Owner: {selectedCollection.owner}
                    </p>
                    <p style={{ 
                      color: 'var(--text-tertiary)',
                      fontSize: '0.85rem',
                      margin: 0
                    }}>
                      <i className="fas fa-key me-1"></i> Access: {selectedCollection.permission}
                    </p>
                    <p style={{ 
                      color: 'var(--text-tertiary)',
                      fontSize: '0.85rem',
                      margin: 0
                    }}>
                      <i className="fas fa-calendar me-1"></i> Created: {new Date(selectedCollection.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {!selectedTask && (
                <TaskManager
                  collectionId={selectedCollection.id}
                  permission={selectedCollection.permission}
                  onTaskSelect={setSelectedTask}
                />
              )}

              {selectedTask && (
                <TaskView
                  taskId={selectedTask.id}
                  permission={selectedCollection.permission}
                  onClose={() => setSelectedTask(null)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ 
            display: 'flex', 
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <i className="fas fa-users" style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              opacity: 0.3
            }}></i>
            <h3 style={{ 
              margin: '0.5rem 0',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              No Shared Collection Selected
            </h3>
            <p style={{ margin: 0 }}>
              Select a shared collection from the sidebar to view its tasks
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedCollectionList;