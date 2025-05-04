import React, { createContext, useContext, useState } from "react";

// Creating mock data
const mockEvents = [
  {
    id: "event-1",
    title: "Team Meeting",
    start: new Date(2025, 4, 5, 10, 0),
    end: new Date(2025, 4, 5, 11, 30),
    color: "#039be5",
    location: "Conference Room A",
    description: "Weekly team sync-up meeting"
  },
  {
    id: "event-2",
    title: "Lunch with Client",
    start: new Date(2025, 4, 6, 12, 0),
    end: new Date(2025, 4, 6, 13, 30),
    color: "#33b679",
    location: "Downtown Cafe",
    description: "Discuss upcoming project requirements"
  },
  {
    id: "event-3",
    title: "Project Deadline",
    start: new Date(2025, 4, 8, 9, 0),
    end: new Date(2025, 4, 8, 17, 0),
    color: "#e67c73",
    location: "Office",
    description: "Final submission of project deliverables"
  }
];

const mockTasks = [
  {
    id: "task-1",
    title: "Complete weekly report",
    date: new Date(2025, 4, 4),
    completed: false
  },
  {
    id: "task-2",
    title: "Review pull requests",
    date: new Date(2025, 4, 5),
    completed: true
  },
  {
    id: "task-3",
    title: "Prepare presentation slides",
    date: new Date(2025, 4, 7),
    completed: false
  }
];

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(mockEvents);
  const [tasks, setTasks] = useState(mockTasks);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    };
    setEvents([...events, newEvent]);
    alert("Event added successfully!");
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    alert("Event updated successfully!");
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
    alert("Event deleted successfully!");
  };

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks([...tasks, newTask]);
    alert("Task added successfully!");
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    alert("Task updated successfully!");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    alert("Task deleted successfully!");
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        tasks,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};