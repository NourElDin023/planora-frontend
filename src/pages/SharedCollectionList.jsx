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
      // If there's an ID or token in the URL, try to find and select that collection
      const foundCollection = collections.find(c => 
        id ? c.id === parseInt(id) : c.shareable_link_token === token
      );
      if (foundCollection) {
        handleCollectionClick(foundCollection);
      }
    } else if (collections.length > 0) {
      // Otherwise select the first collection by default
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
      
      // Update the URL without navigating away
      if (collection.shareable_link_token) {
        navigate(`/shared-page/${collection.shareable_link_token}/`, { replace: true });
      } else {
        navigate(`/collections/${collection.id}/`, { replace: true });
      }
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        borderRight: '1px solid #ccc',
        padding: '1rem',
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Shared Collections</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {collections.map((collection) => (
            <li
              key={collection.id}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: selectedCollection?.id === collection.id 
                  ? 'rgba(125, 38, 205, 0.1)' 
                  : 'transparent',
                border: selectedCollection?.id === collection.id 
                  ? '1px solid #7D26CD' 
                  : 'none',
                position: 'relative',
                marginBottom: '4px',
              }}
              onClick={() => handleCollectionClick(collection)}
            >
              <div>
                <strong>{collection.title}</strong>
                <p style={{ 
                  margin: '2px 0 0',
                  fontSize: '0.8em',
                  color: '#888'
                }}>
                  Owner: {collection.owner}
                </p>
                {collection.description && (
                  <p style={{ 
                    margin: '4px 0 0',
                    fontSize: '0.9em',
                    color: '#666'
                  }}>
                    {collection.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
        {selectedCollection ? (
          <div>
            {/* Breadcrumb Tracker */}
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => {
                  setSelectedCollection(null);
                  setSelectedTask(null);
                  navigate('/shared-collections');
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
                Shared Collections
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

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <h2 style={{ margin: 0 }}>{selectedCollection.title}</h2>
                {selectedCollection.description && (
                  <p style={{
                    marginTop: '4px',
                    color: '#555',
                    fontStyle: 'italic'
                  }}>
                    {selectedCollection.description}
                  </p>
                )}
                <p style={{ marginTop: '4px', color: '#777' }}>
                  Shared with: {selectedCollection.permission} access
                </p>
              </div>
              {!selectedTask && (
                <TaskManager
                  collectionId={selectedCollection.id}
                  permission={selectedCollection.permission}
                  onTaskSelect={setSelectedTask}
                />
              )}
            </div>

            {selectedTask ? (
              <TaskView
                taskId={selectedTask.id}
                permission={selectedCollection.permission}
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

export default SharedCollectionList;