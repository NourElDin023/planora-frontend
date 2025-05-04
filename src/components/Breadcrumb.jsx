import React from 'react';

const Breadcrumb = ({
  selectedCollection,
  selectedTask,
  showSharePage,
  setSelectedCollection,
  setSelectedTask,
  setShowSharePage,
  sidebarVisible,
  setSidebarVisible,
}) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        style={{
          background: 'none',
          border: 'none',
          color: '#0d6efd',
          cursor: 'pointer',
          padding: '0 10px 0 0',
          fontSize: '1.2rem',
        }}
        title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        <i className={sidebarVisible ? 'fas fa-times' : 'fas fa-bars'}></i>
      </button>

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
          <span>/</span>
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
          <span>/</span>
          <span style={{ color: '#0d6efd' }}>{selectedTask.title}</span>
        </>
      )}

      {showSharePage && (
        <>
          <span>/</span>
          <span style={{ color: '#0d6efd' }}>Share Settings</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
