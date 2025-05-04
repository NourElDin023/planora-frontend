import React, { useState } from "react";
import { useEvents } from "../../context/EventContext";
import { MiniCalendar } from "./MiniCalendar";

export const CalendarSidebar = () => {
  const { tasks } = useEvents();
  const [calendars, setCalendars] = useState([
    { id: "personal", name: "My Calendar", checked: true, color: "#1a73e8" },
    { id: "work", name: "Work", checked: true, color: "#7986cb" },
    { id: "birthdays", name: "Birthdays", checked: true, color: "#33b679" },
  ]);

  const pendingTasks = tasks.filter(task => !task.completed);

  const toggleCalendar = (id) => {
    setCalendars(
      calendars.map(cal => 
        cal.id === id ? { ...cal, checked: !cal.checked } : cal
      )
    );
  };
  
  return (
    <aside className="calendar-sidebar">
      <MiniCalendar />
      
      {pendingTasks.length > 0 && (
        <div className="alert alert-light p-2">
          <div className="d-flex align-items-center gap-2 text-secondary">
            <span className="d-inline-block bg-primary rounded-circle" style={{ width: "8px", height: "8px" }}></span>
            <span>{pendingTasks.length} pending tasks</span>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="fs-6 fw-medium mb-2">My calendars</h3>
        <ul className="list-unstyled">
          {calendars.map(cal => (
            <li key={cal.id} className="mb-2 d-flex align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`calendar-${cal.id}`}
                  checked={cal.checked}
                  onChange={() => toggleCalendar(cal.id)}
                  style={{ 
                    backgroundColor: cal.checked ? cal.color : 'transparent',
                    borderColor: cal.color 
                  }}
                />
                <label 
                  className="form-check-label"
                  htmlFor={`calendar-${cal.id}`}
                >
                  {cal.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4">
        <h3 className="fs-6 fw-medium mb-2">Tasks</h3>
        <ul className="list-unstyled">
          {tasks.map(task => (
            <li key={task.id} className="mb-2 d-flex align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={task.completed}
                />
                <label 
                  className="form-check-label"
                  htmlFor={`task-${task.id}`}
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                >
                  {task.title}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};