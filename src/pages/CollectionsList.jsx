import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import TaskManager from '../components/TaskManager';
import TaskView from '../components/TaskView';
import SharePageComponent from '../components/SharePageComponent';
import PomodoroTimer from '../components/PomodoroTimer';

const CollectionsList = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSharePage, setShowSharePage] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const cachedCollections = localStorage.getItem('collections');
    if (cachedCollections) {
      setCollections(JSON.parse(cachedCollections));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.collection-menu')) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    fetchCollections();
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);


  const fetchCollections = async () => {
    try {
      const res = await axios.get('collections/');
      setCollections(res.data);
      console.log(res.data);
      if (res.data.length > 0) {
        handleCollectionClick(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching collections', err);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this collection and all its tasks?'
      )
    ) {
      return;
    }

    try {
      await axios.delete(`collections/${collectionId}/`);
      setCollections(collections.filter((c) => c.id !== collectionId));

      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
      }
    } catch (err) {
      console.error('Error deleting collection', err);
      alert('Failed to delete collection');
    }
  };

  const handleCollectionClick = async (collection) => {
    try {
      const res = await axios.get(`collections/${collection.id}/tasks/`);
      setSelectedCollection(res.data.collection);
      setSelectedTask(null);
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
            Collections
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className="icon-button"
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--primary-border)',
                backgroundColor: 'var(--primary-bg)',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                ':hover': {
                  backgroundColor: 'var(--primary-hover)'
                }
              }}
              title="Pomodoro Timer"
            >
              <i className="fas fa-clock"></i>
            </button>
            <Link
              to="/addcollections"
              className="add-button"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success-color)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: 'var(--success-hover)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <i className="fas fa-plus"></i>
            </Link>
          </div>
        </div>

        {/* Pomodoro Timer */}
        {showPomodoro && (
          <div className="pomodoro-container" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: '0 2px 12px var(--shadow-color)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <h5 style={{ 
                margin: 0, 
                fontSize: '0.9rem',
                fontWeight: '500',
                color: 'var(--primary-color)'
              }}>
                <i className="fas fa-clock me-1"></i> Focus Timer
              </h5>
              <button
                onClick={() => setShowPomodoro(false)}
                style={{
                  background: 'var(--icon-bg)',
                  border: 'none',
                  borderRadius: '6px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    backgroundColor: 'var(--icon-hover)'
                  }
                }}
              >
                <i className="fas fa-times" style={{ fontSize: '0.8rem' }}></i>
              </button>
            </div>
            <PomodoroTimer />
          </div>
        )}

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
                ':hover': {
                  backgroundColor: 'var(--hover-bg)',
                  borderColor: 'var(--hover-border)'
                }
              }}
            >
              <div 
                onClick={() => handleCollectionClick(collection)} 
                style={{ 
                  cursor: 'pointer', 
                  paddingRight: '2rem',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: '500', 
                  marginBottom: '0.25rem',
                  color: 'var(--text-color)'
                }}>
                  {collection.title}
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
              
              {/* Collection Menu */}
              <div style={{ 
                position: 'absolute', 
                right: '0.75rem', 
                top: '0.75rem'
              }}>
                <button
                  className="collection-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === collection.id ? null : collection.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      backgroundColor: 'var(--icon-bg)'
                    }
                  }}
                >
                  <i className="fas fa-ellipsis-v" style={{ fontSize: '0.9rem' }}></i>
                </button>

                {activeMenuId === collection.id && (
                  <div
                    className="dropdown-menu"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      backgroundColor: 'var(--dropdown-bg)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px var(--shadow-color)',
                      minWidth: '140px',
                      padding: '0.5rem',
                      zIndex: 100,
                      border: '1px solid var(--dropdown-border)',
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(`/editcollection/${collection.id}`)}
                      className="dropdown-item"
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: 'var(--text-color)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        ':hover': {
                          backgroundColor: 'var(--dropdown-hover)'
                        }
                      }}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="dropdown-item danger"
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: 'var(--danger-color)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        ':hover': {
                          backgroundColor: 'var(--danger-bg)'
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
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

        {!window.location.pathname.includes('/new') &&
          (selectedCollection ? (
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
                    setShowSharePage(false);
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
                  <i className="fas fa-folder"></i> Collections
                </button>

                {selectedCollection && (
                  <>
                    <i className="fas fa-chevron-right" style={{ 
                      fontSize: '0.7rem', 
                      opacity: 0.6,
                      color: 'var(--text-secondary)'
                    }}></i>
                    <button
                      onClick={() => {
                        setSelectedTask(null);
                        setShowSharePage(false);
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
                      {selectedCollection.title}
                    </button>
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

                {showSharePage && (
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
                      <i className="fas fa-share-alt"></i> Share Settings
                    </span>
                  </>
                )}
              </div>

              {/* Collection Content */}
              <div>
                {!showSharePage && !selectedTask && (
                  <div style={{ marginBottom: '2rem' }}>
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
                        <p style={{ 
                          marginTop: '0.5rem',
                          color: 'var(--text-tertiary)',
                          fontSize: '0.85rem'
                        }}>
                          Created: {new Date(selectedCollection.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSharePage(true)}
                        style={{
                          background: 'var(--primary-bg)',
                          color: 'var(--primary-color)',
                          border: '1px solid var(--primary-border)',
                          borderRadius: '8px',
                          padding: '0.75rem 1.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          flexShrink: 0,
                          ':hover': {
                            background: 'var(--primary-hover)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        <i className="fas fa-share"></i> Share Collection
                      </button>
                    </div>
                    <TaskManager
                      key={selectedCollection.id}
                      collectionId={selectedCollection.id}
                      onTaskSelect={setSelectedTask}
                      permission={'edit'}
                    />
                  </div>
                )}

                {showSharePage && (
                  <div style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '12px',
                    padding: '2rem',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 4px 12px var(--shadow-color)'
                  }}>
                    <SharePageComponent
                      pageId={selectedCollection.id}
                      onClose={() => setShowSharePage(false)}
                    />
                  </div>
                )}

                {selectedTask && !showSharePage && (
                  <TaskView
                    key={selectedCollection.id}
                    taskId={selectedTask.id}
                    onClose={() => setSelectedTask(null)}
                    permission={'edit'}
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
              <i className="fas fa-folder-open" style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                opacity: 0.3
              }}></i>
              <h3 style={{ 
                margin: '0.5rem 0',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}>
                No Collection Selected
              </h3>
              <p style={{ margin: 0 }}>
                Select a collection from the sidebar to view its tasks
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
export default CollectionsList;
