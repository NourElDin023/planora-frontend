import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { parse, format } from 'date-fns';
import axiosInstance from '../utils/axios';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (collectionId = null) => {
    setLoading(true);
    setError(null);
    console.log('Fetching events from backend...');

    try {
      const endpoint = collectionId ? `/collections/${collectionId}/tasks/` : '/tasks/';
      const response = await axiosInstance.get(endpoint);
      console.log('API response:', response.data); // Log the full API response for debugging
      const fetchedTasks = response.data.tasks || response.data; // Adjust to handle different response formats

      if (!Array.isArray(fetchedTasks)) {
        throw new Error('Unexpected response format: tasks data is not an array');
      }
      console.log('Fetched tasks:', fetchedTasks);

      const formattedEvents = fetchedTasks
        .map((task) => {
          let startDate, endDate;
          const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';

          if (!task.due_date || !task.start_time || !task.end_time) {
            console.warn(`Task ${task.id} ('${task.title}') is missing date/time information. Skipping.`);
            return null;
          }

          try {
            startDate = parse(
              `${task.due_date} ${task.start_time}`,
              dateTimeFormat,
              new Date()
            );
            if (isNaN(startDate)) throw new Error('Invalid start date/time string');
          } catch (e) {
            console.error(
              `Error parsing start date/time for task ${task.id} ('${task.title}'): ${task.due_date} ${task.start_time}`,
              e
            );
            return null;
          }

          try {
            endDate = parse(
              `${task.due_date} ${task.end_time}`,
              dateTimeFormat,
              new Date()
            );
            if (isNaN(endDate)) throw new Error('Invalid end date/time string');

            if (endDate < startDate) {
              console.warn(`Task ${task.id} ('${task.title}') has end time before start time. Adjusting end time.`);
              endDate = startDate;
            }
          } catch (e) {
            console.error(
              `Error parsing end date/time for task ${task.id} ('${task.title}'): ${task.due_date} ${task.end_time}`,
              e
            );
            return null;
          }

          return {
            id: task.id,
            title: task.title,
            start: startDate,
            end: endDate,
            details: task.details,
            category: task.category,
            completed: task.completed,
            owner: task.owner,
            color: task.completed ? '#9e9e9e' : (task.color || '#039be5'),
            // Keep original task data for reference
            originalTask: task,
          };
        })
        .filter((event) => event !== null);

      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching or processing tasks:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load tasks. Please try again.'
      );
    } finally {
      setLoading(false);
      console.log('Fetching complete.');
    }
  }, []);

  // Format event data to match the API's expected task format
  const formatEventToTask = (eventData) => {
    const due_date = format(eventData.start, 'yyyy-MM-dd');
    const start_time = format(eventData.start, 'HH:mm:ss');
    const end_time = format(eventData.end, 'HH:mm:ss');

    return {
      title: eventData.title,
      details: eventData.details || "",
      due_date,
      start_time,
      end_time,
      completed: eventData.completed || false,
      // Add any additional fields required by your API
    };
  };

  // Add a new event (task)
  const addEvent = async (eventData) => {
    try {
      setLoading(true);
      const taskData = formatEventToTask(eventData);
      
      // Send request to create a new task
      const response = await axiosInstance.post('/tasks/', taskData);
      
      // Refresh the event list to include the new task
      await fetchEvents();
      
      return response.data;
    } catch (err) {
      console.error('Error adding event:', err);
      setError(err.response?.data?.message || 'Failed to add event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing event (task)
  const updateEvent = async (eventData) => {
    try {
      setLoading(true);
      const taskData = formatEventToTask(eventData);
      
      // Send request to update the task
      const response = await axiosInstance.patch(`/tasks/${eventData.id}/`, taskData);
      
      // Update events in state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventData.id 
            ? { 
                ...event, 
                ...eventData, 
                originalTask: { ...event.originalTask, ...taskData } 
              } 
            : event
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.response?.data?.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an existing event (task)
  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      
      // Send request to delete the task
      await axiosInstance.delete(`/tasks/${eventId}/`);
      
      // Remove the deleted event from state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        refetchEvents: fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};