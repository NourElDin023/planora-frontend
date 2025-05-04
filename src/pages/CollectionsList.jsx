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
  const [sidebarVisible, setSidebarVisible] = useState(true); // New state for sidebar visibility
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
      />

      {/* Moved PomodoroSection here, outside of the sidebar */}
      <PomodoroSection
        showPomodoro={showPomodoro}
        setShowPomodoro={setShowPomodoro}
      />
    </div>
  );
};

export default CollectionsList;
