import React from 'react';
import { Outlet } from 'react-router-dom';
import TaskManager from './TaskManager';
import TaskView from './TaskView';
import SharePageComponent from './SharePageComponent';
import Breadcrumb from './Breadcrumb';

const MainContentArea = ({
  selectedCollection,
  selectedTask,
  showSharePage,
  setSelectedCollection,
  setSelectedTask,
  setShowSharePage,
  onTaskSelect,
  sidebarVisible,
  setSidebarVisible,
  isSharedCollections,
  permission,
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
              sidebarVisible={sidebarVisible}
              setSidebarVisible={setSidebarVisible}
            />

            {!selectedTask && !showSharePage && (
              <TaskManager
                key={selectedCollection.id}
                collectionId={selectedCollection.id}
                onTaskSelect={onTaskSelect}
                permission={permission}
                setShowSharePage={setShowSharePage}
                isSharedCollections={isSharedCollections}
              />
            )}

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
                permission={permission}
              />
            )}
          </div>
        ) : (
          <div>
            <Breadcrumb
              selectedCollection={selectedCollection}
              selectedTask={selectedTask}
              showSharePage={showSharePage}
              setSelectedCollection={setSelectedCollection}
              setSelectedTask={setSelectedTask}
              setShowSharePage={setShowSharePage}
              sidebarVisible={sidebarVisible}
              setSidebarVisible={setSidebarVisible}
            />
            <p>Select a collection to view its tasks.</p>
          </div>
        ))}
    </div>
  );
};

export default MainContentArea;
