import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import MainContentArea from '../components/MainContentArea';
import CollectionsSidebar from '../components/CollectionsSidebar';
import PomodoroSection from '../components/PomodoroSection';

const CollectionsList = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSharePage, setShowSharePage] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const collectionName = searchParams.get('collection');
    if (collectionName && collections.length > 0) {
      const foundCollection = collections.find(
        (c) => c.title.toLowerCase() === collectionName.toLowerCase()
      );
      if (foundCollection) {
        handleCollectionClick(foundCollection);
      } else {
        console.log(`Collection "${collectionName}" not found`);
        alert(`Collection "${collectionName}" not found`);
      }
    }
  }, [collections, searchParams]);

  const fetchCollections = async () => {
    try {
      const res = await axios.get('collections/');
      setCollections(res.data);
      if (res.data.length > 0) {
        handleCollectionClick(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching collections', err);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await axios.delete(`collections/${collectionId}/`);
      setCollections(collections.filter((c) => c.id !== collectionId));

      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
      }

      setCollectionToDelete(null);
    } catch (err) {
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
      <CollectionsSidebar
        collections={collections}
        selectedCollection={selectedCollection}
        showPomodoro={showPomodoro}
        setShowPomodoro={setShowPomodoro}
        handleCollectionClick={handleCollectionClick}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        navigate={navigate}
        handleDeleteCollection={handleDeleteCollection}
        sidebarVisible={sidebarVisible}
        setCollectionToDelete={setCollectionToDelete}
        isSharedCollections={false}
      />

      <MainContentArea
        selectedCollection={selectedCollection}
        selectedTask={selectedTask}
        showSharePage={showSharePage}
        setSelectedCollection={setSelectedCollection}
        setSelectedTask={setSelectedTask}
        setShowSharePage={setShowSharePage}
        onTaskSelect={setSelectedTask}
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
        isSharedCollections={false}
        permission={"edit"}
      />

      <PomodoroSection
        showPomodoro={showPomodoro}
        setShowPomodoro={setShowPomodoro}
      />

      {collectionToDelete && (
        <div
          className="position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-white p-4 rounded shadow text-center">
            <p>Are you sure you want to delete this collection?</p>
            <p className="text-primary fw-bold">{collectionToDelete.title}</p>
            <p className="text-danger small">
              This will delete all tasks within this collection.
            </p>
            <div className="d-flex gap-3 justify-content-center mt-4">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteCollection(collectionToDelete.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCollectionToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsList;
