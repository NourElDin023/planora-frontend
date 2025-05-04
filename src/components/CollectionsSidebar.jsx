import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CollectionsMenu from './CollectionsMenu';

const CollectionsSidebar = ({
  collections,
  selectedCollection,
  showPomodoro,
  setShowPomodoro,
  handleCollectionClick,
  activeMenuId,
  setActiveMenuId,
  navigate,
  handleDeleteCollection,
  sidebarVisible,
  setCollectionToDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      collection.title?.toLowerCase().includes(query) ||
      collection.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div
      style={{
        width: sidebarVisible ? '310px' : '0px',
        borderRight: '1px solid #ccc',
        padding: sidebarVisible ? '1rem' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        opacity: sidebarVisible ? '1' : '0',
        transform: sidebarVisible ? 'translateX(0)' : 'translateX(-20px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          minWidth: '280px',
        }}
      >
        <h3 style={{ margin: 0 }}>Collections</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setShowPomodoro(!showPomodoro)}
            className="btn btn-outline-primary"
            title="Pomodoro Timer"
          >
            <i className="fas fa-clock"></i>
          </button>
          <Link to="/addcollections" className="btn btn-outline-primary">
            <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

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
          minWidth: '280px',
        }}
      />

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          minWidth: '280px',
        }}
      >
        {filteredCollections.map((collection) => (
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
                  ? '1px solid #0d6efd'
                  : 'none',
              position: 'relative',
              marginBottom: '8px',
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

            <CollectionsMenu
              collection={collection}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              navigate={navigate}
              handleDeleteCollection={handleDeleteCollection}
              setCollectionToDelete={setCollectionToDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsSidebar;
