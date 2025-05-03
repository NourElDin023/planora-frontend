import React from 'react';

const CollectionHeader = ({ 
  selectedCollection, 
  showSharePage, 
  setShowSharePage,
  selectedTask,
  collectionId
}) => {
  if (showSharePage || selectedTask) return null;

  return (
    <div>
      <h2>{selectedCollection.title}</h2>

      {selectedCollection.description && (
        <p style={{
          marginTop: '4px',
          color: '#555',
          fontStyle: 'italic',
        }}>
          {selectedCollection.description}
        </p>
      )}
      
      <p style={{ marginTop: '4px', color: '#777' }}>
        Created: {new Date(selectedCollection.created_at).toLocaleString()}
      </p>
      <button
        onClick={() => setShowSharePage(true)}
        style={{
          background: '#0d6efd',
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
    </div>
  );
};

export default CollectionHeader;