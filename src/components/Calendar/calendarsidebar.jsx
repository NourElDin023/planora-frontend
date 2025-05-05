import React, { useState, useEffect } from "react";
import { useEvents } from "../../context/EventContext";
import { MiniCalendar } from "../calendar/MiniCalendar";
import axios from "../../utils/axios";

export const CalendarSidebar = () => {
  const { events, refetchEvents } = useEvents(); // Added refetchEvents to update calendar tasks
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null); // Single selected collection
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoadingCollections(true);
      setError(null);
      try {
        const response = await axios.get("collections/");
        setCollections(response.data);
      } catch (error) {
        setError(error.message || "Failed to load collections");
        console.error("Error fetching collections:", error);
      } finally {
        setLoadingCollections(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchTasksForSelected = async () => {
      if (selectedCollection) {
        try {
          await refetchEvents(selectedCollection); // Pass the selected collection ID to refetchEvents
        } catch (error) {
          setError(error.message || "Failed to load tasks for the selected collection");
          console.error("Error fetching tasks for the selected collection:", error);
        }
      } else {
        await refetchEvents(); // Fetch all tasks if no collection is selected
      }
    };

    fetchTasksForSelected();
  }, [selectedCollection, refetchEvents]);

  const selectCollection = (id, title) => {
    setSelectedCollection((prev) => (prev === id ? null : id)); // Toggle selection

    // Automatically send a message to suggest tasks for the selected collection
    if (prev !== id) {
      const chatWidgetInput = document.querySelector('.chat-widget-input');
      if (chatWidgetInput) {
        chatWidgetInput.value = `Suggest tasks for the collection: ${title}`;
        chatWidgetInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      }
    }
  };

  if (loadingCollections) {
    return <aside className="calendar-sidebar">Loading calendars...</aside>;
  }

  if (error) {
    return <aside className="calendar-sidebar">Error loading: {error}</aside>;
  }

  return (
    <aside className="calendar-sidebar">
      <MiniCalendar />

      <div className="mt-4">
        <h3 className="fs-6 fw-medium mb-2">My calendars</h3>
        <ul className="list-unstyled">
          {collections.map((collection) => (
            <li key={collection.id} className="mb-2 d-flex align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio" // Radio button for single selection
                  id={`calendar-${collection.id}`}
                  checked={selectedCollection === collection.id}
                  onChange={() => selectCollection(collection.id, collection.title || collection.name || `Calendar ${collection.id}`)}
                  style={{
                    backgroundColor: selectedCollection === collection.id
                      ? collection.color || "transparent"
                      : "transparent",
                    borderColor: collection.color || "#ccc",
                    appearance: "auto",
                  }}
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor={`calendar-${collection.id}`}
                  style={{ color: collection.color }}
                >
                  {collection.title || collection.name || `Calendar ${collection.id}`}
                </label>
              </div>
            </li>
          ))}
          {collections.length === 0 && !loadingCollections && (
            <li className="text-muted">No calendars available.</li>
          )}
        </ul>
      </div>
    </aside>
  );
};