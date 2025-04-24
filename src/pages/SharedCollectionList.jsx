import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import TaskManager from '../components/TaskManager';
import TaskView from '../components/TaskView';

const SharedCollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSharedCollections();
  }, []);

  const fetchSharedCollections = async () => {
    try {
      const res = await axios.get('collections/shared-collections/');
      setCollections(res.data);
      if (res.data.length > 0) {
        handleCollectionClick(res.data[0]);
      }
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
      });
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
          width: '250px',
          borderRight: '1px solid #ccc',
          padding: '1rem',
        }}
      >
        <h3>Shared Collections</h3>
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
              }}
              onClick={() => handleCollectionClick(collection)}
            >
              <strong>{collection.title}</strong>
              {collection.description && (
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  {collection.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
        {selectedCollection ? (
          <div>
            <h2>{selectedCollection.title}</h2>
            {selectedCollection.description && (
              <p style={{ fontStyle: 'italic', color: '#555' }}>
                {selectedCollection.description}
              </p>
            )}
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
        ) : (
          <p>Select a shared collection to view its tasks.</p>
        )}
      </div>
    </div>
  );
};

export default SharedCollectionList;
