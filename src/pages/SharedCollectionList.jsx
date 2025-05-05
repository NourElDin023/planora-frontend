import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import MainContentArea from '../components/MainContentArea';
import CollectionsSidebar from '../components/CollectionsSidebar';

const SharedCollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSharePage, setShowSharePage] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
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
      console.log('Shared collections:', res.data);
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
        sidebarVisible={sidebarVisible}
        isSharedCollections={true}
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
        isSharedCollections={true}
        permission={selectedCollection?.shareable_permission}
      />
    </div>
  );
};

export default SharedCollectionList;