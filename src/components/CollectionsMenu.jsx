import React from 'react';

const CollectionsMenu = ({
  collection,
  activeMenuId,
  setActiveMenuId,
  navigate,
  handleDeleteCollection,
  setCollectionToDelete,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        right: '8px',
        top: '4px',
      }}
    >
      <button
        className="collection-menu"
        onClick={(e) => {
          e.stopPropagation();
          setActiveMenuId(
            activeMenuId === collection.id ? null : collection.id
          );
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#666',
          cursor: 'pointer',
          padding: '2px 5px',
          fontSize: '1.2em',
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </button>

      {activeMenuId === collection.id && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '120px',
            zIndex: 100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => navigate(`/editcollection/${collection.id}`)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              ':hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setCollectionToDelete(collection);
              setActiveMenuId(null); // Close the menu
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              color: '#ff4444',
              ':hover': {
                backgroundColor: '#ffecec',
              },
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionsMenu;
