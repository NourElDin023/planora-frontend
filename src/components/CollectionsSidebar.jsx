import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CollectionsMenu from './CollectionsMenu';
import PomodoroSection from './PomodoroSection';

const CollectionsSidebar = ({
  collections,
  selectedCollection,
  showPomodoro,
  setShowPomodoro,
  handleCollectionClick,
  activeMenuId,
  setActiveMenuId,
  navigate,
  handleDeleteCollection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter collections based on search query
  const filteredCollections = collections.filter(collection => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      collection.title?.toLowerCase().includes(query) ||
      collection.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{
      width: '350px',
      borderRight: '1px solid #ccc',
      padding: '1rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <h3 style={{ margin: 0 }}>Collections</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setShowPomodoro(!showPomodoro)}
            style={{
              padding: '4px 8px',
              background: '#0d6efd',
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

      <PomodoroSection showPomodoro={showPomodoro} setShowPomodoro={setShowPomodoro} />

      <input
        type="text"
        placeholder="Search collections..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredCollections.map((collection) => (
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
                ? '1px solid #0d6efd'
                : 'none',
              position: 'relative',
              marginBottom: '8px'
            }}
          >
            <div onClick={() => handleCollectionClick(collection)}>
              <strong>{collection.title}</strong>
              {collection.description && (
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '0.9em',
                  color: '#666',
                }}>
                  {collection.description}
                </p>
              )}
            </div>
            
            <CollectionsMenu 
              collection={collection}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              navigate={navigate}
              handleDeleteCollection={handleDeleteCollection}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsSidebar;