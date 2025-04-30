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

  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '350px',
          borderRight: '1px solid #ccc',
          padding: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ margin: 0 }}>Collections</h3>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              style={{
                padding: '4px 8px',
                background: '#7D26CD',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                border: 'none',
              }}
              title="Pomodoro Timer"
            >
              <i className="fas fa-clock"></i>
            </button>
            <Link
              to="/addcollections"
              style={{
                padding: '4px 8px',
                background: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              +
            </Link>
          </div>
        </div>

        {/* Pomodoro Timer (Collapsible) */}
        {showPomodoro && (
          <div style={{ 
            marginBottom: '1rem',
            padding: '0.75rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(125,38,205,0.05) 0%, rgba(125,38,205,0.1) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h5 style={{ margin: '0', fontSize: '0.9rem', color: '#7D26CD' }}>
                <i className="fas fa-clock me-1"></i> Focus Timer
              </h5>
              <button
                onClick={() => setShowPomodoro(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: 0
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <PomodoroTimer />
          </div>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {collections.map((collection) => (
            <li
              key={collection.id}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor:
                  selectedCollection?.id === collection.id
                    ? 'rgba(125, 38, 205, 0.1)'
                    : 'transparent',
                border:
                  selectedCollection?.id === collection.id
                    ? '1px solid #7D26CD'
                    : 'none',
                position: 'relative',
              }}
            >
              <div onClick={() => handleCollectionClick(collection)}>
                <strong>{collection.title}</strong>
                {collection.description && (
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.9em',
                      color: '#666',
                    }}
                  >
                    {collection.description}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCollection(collection.id);
                }}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ff4444',
                  cursor: 'pointer',
                  padding: '2px 5px',
                  borderRadius: '50%',
                  fontSize: '0.9em',
                }}
                title="Delete collection"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <Outlet />

        {!window.location.pathname.includes('/new') &&
          (selectedCollection ? (
            <div>
              {/* Clickable Breadcrumb Tracker */}
              <div
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <button
                  onClick={() => {
                    setSelectedCollection(null);
                    setSelectedTask(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7D26CD',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Collections
                </button>

                {selectedCollection && (
                  <>
                    <span>&gt;</span>
                    {selectedTask ? (
                      <button
                        onClick={() => setSelectedTask(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#7D26CD',
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        {selectedCollection.title}
                      </button>
                    ) : (
                      <span style={{ color: '#7D26CD' }}>
                        {selectedCollection.title}
                      </span>
                    )}
                  </>
                )}

                {selectedTask && (
                  <>
                    <span>&gt;</span>
                    <span style={{ color: '#7D26CD' }}>
                      {selectedTask.title}
                    </span>
                  </>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h2>{selectedCollection.title}</h2>

                  {selectedCollection.description && (
                    <p
                      style={{
                        marginTop: '4px',
                        color: '#555',
                        fontStyle: 'italic',
                      }}
                    >
                      {selectedCollection.description}
                    </p>
                  )}
                  {!showSharePage && !selectedTask && (
                    <>
                      <p style={{ marginTop: '4px', color: '#777' }}>
                        Created:{' '}
                        {new Date(
                          selectedCollection.created_at
                        ).toLocaleString()}
                      </p>
                      <button
                        onClick={() => setShowSharePage(true)}
                        style={{
                          background: '#7D26CD',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          height: 'fit-content',
                        }}
                      >
                        Share Collection
                      </button>
                    </>
                  )}
                </div>
                {!selectedTask && !showSharePage && (
                  <TaskManager
                    collectionId={selectedCollection.id}
                    onTaskSelect={setSelectedTask}
                    permission={"edit"}
                  />
                )}
              </div>
              {showSharePage && (
                <div style={{ marginTop: '2rem' }}>
                  <SharePageComponent
                    pageId={selectedCollection.id}
                    onClose={() => setShowSharePage(false)}
                  />
                </div>
              )}
              {selectedTask && !showSharePage ? (
                <TaskView
                  taskId={selectedTask.id}
                  onClose={() => setSelectedTask(null)}
                  permission={"edit"}
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <p>Select a collection to view its tasks.</p>
          ))}
      </div>
    </div>
  );
};

export default CollectionsList;
