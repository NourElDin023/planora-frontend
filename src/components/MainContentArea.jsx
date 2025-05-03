import React from 'react';
import { Outlet } from 'react-router-dom';
import TaskManager from './TaskManager';
import TaskView from './TaskView';
import SharePageComponent from './SharePageComponent';
import Breadcrumb from './Breadcrumb';
import CollectionHeader from './CollectionHeader';

const MainContentArea = ({
  selectedCollection,
  selectedTask,
  showSharePage,
  setSelectedCollection,
  setSelectedTask,
  setShowSharePage,
  onTaskSelect
}) => {
  return (
    <div style={{ flex: 1, padding: '1rem' }}>
      <Outlet />

      {!window.location.pathname.includes('/new') &&
        (selectedCollection ? (
          <div>
            <Breadcrumb
              selectedCollection={selectedCollection}
              selectedTask={selectedTask}
              showSharePage={showSharePage}
              setSelectedCollection={setSelectedCollection}
              setSelectedTask={setSelectedTask}
              setShowSharePage={setShowSharePage}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <CollectionHeader
                selectedCollection={selectedCollection}
                showSharePage={showSharePage}
                setShowSharePage={setShowSharePage}
                selectedTask={selectedTask}
              />
              
              {!selectedTask && !showSharePage && (
                <TaskManager
                  key={selectedCollection.id}
                  collectionId={selectedCollection.id}
                  onTaskSelect={onTaskSelect}
                  permission={'edit'}
                />
              )}
            </div>

            {showSharePage && (
              <div style={{ marginTop: '2rem' }}>
                <SharePageComponent
                  pageId={selectedCollection.id}
                  onClose={() => setShowSharePage(false)}
                />
              </div>
            )}

            {selectedTask && !showSharePage && (
              <TaskView
                key={selectedCollection.id}
                taskId={selectedTask.id}
                onClose={() => setSelectedTask(null)}
                permission={'edit'}
              />
            )}
          </div>
        ) : (
          <p>Select a collection to view its tasks.</p>
        ))}
    </div>
  );
};

export default MainContentArea;