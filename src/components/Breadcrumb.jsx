import React from 'react';

const Breadcrumb = ({
  selectedCollection,
  selectedTask,
  showSharePage,
  setSelectedCollection,
  setSelectedTask,
  setShowSharePage
}) => {
  return (
    <div style={{
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <button
        onClick={() => {
          setSelectedCollection(null);
          setSelectedTask(null);
          setShowSharePage(false);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#0d6efd',
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
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowSharePage(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d6efd',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {selectedCollection.title}
          </button>
        </>
      )}

      {selectedTask && (
        <>
          <span>&gt;</span>
          <span style={{ color: '#0d6efd' }}>
            {selectedTask.title}
          </span>
        </>
      )}

      {showSharePage && (
        <>
          <span>&gt;</span>
          <span style={{ color: '#0d6efd' }}>Share Settings</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;