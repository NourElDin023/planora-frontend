import React, { useState, useEffect } from "react";
import { useEvents } from "../../context/EventContext";
import { format, addHours, setHours, setMinutes } from "date-fns";

export const EventDialog = ({ isOpen, onClose, mode, event }) => {
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addHours(new Date(), 1));
  const [color, setColor] = useState("#039be5");

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem('theme') || 'light');
    };

    // Initial setup
    updateTheme();
    
    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', updateTheme);
    
    // Create a MutationObserver to watch for body class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const bodyTheme = document.body.className;
          if (bodyTheme && (bodyTheme === 'light' || bodyTheme === 'dark')) {
            setTheme(bodyTheme);
          }
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => {
      window.removeEventListener('storage', updateTheme);
      observer.disconnect();
    };
  }, []);
  
  // Initialize form when dialog is opened or event changes
  useEffect(() => {
    if (mode === "edit" && event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setLocation(event.location || "");
      setStartDate(event.start || new Date());
      setEndDate(event.end || addHours(new Date(), 1));
      setColor(event.color || "#039be5");
    } else {
      setTitle("");
      setDescription("");
      setLocation("");
      setStartDate(new Date());
      setEndDate(addHours(new Date(), 1));
      setColor("#039be5");
    }
  }, [mode, event, isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      title,
      description,
      location,
      start: startDate,
      end: endDate,
      color,
    };
    
    if (mode === "create") {
      addEvent(eventData);
    } else if (mode === "edit" && event) {
      updateEvent({ ...eventData, id: event.id });
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onClose();
    }
  };
  
  const colorOptions = [
    { value: "#039be5", label: "Blue" },
    { value: "#33b679", label: "Green" },
    { value: "#8e24aa", label: "Purple" },
    { value: "#e67c73", label: "Red" },
    { value: "#f6bf26", label: "Yellow" },
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: theme === 'dark' ? 'var(--card-bg)' : 'white', color: 'var(--text-color)' }}>
          <div className="modal-header" style={{ borderBottomColor: 'var(--border-color, #dee2e6)' }}>
            <h5 className="modal-title">
              {mode === "create" ? "Create Event" : "Edit Event"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} style={{ 
              filter: theme === 'dark' ? 'invert(1)' : 'none' 
            }}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  required
                />
              </div>
              
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={format(startDate, "yyyy-MM-dd")}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const newDate = new Date(startDate);
                      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                      setStartDate(newDate);
                    }}
                  />
                </div>
                
                <div className="col">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={format(endDate, "yyyy-MM-dd")}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const newDate = new Date(endDate);
                      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                      setEndDate(newDate);
                    }}
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={format(startDate, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      setStartDate(setMinutes(setHours(startDate, hours), minutes));
                    }}
                  />
                </div>
                
                <div className="col">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={format(endDate, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      setEndDate(setMinutes(setHours(endDate, hours), minutes));
                    }}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Color</label>
                <select 
                  className="form-select"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colorOptions.map((colorOption) => (
                    <option key={colorOption.value} value={colorOption.value}>
                      {colorOption.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  id="location"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="modal-footer justify-content-between" style={{ borderTopColor: 'var(--border-color, #dee2e6)' }}>
              {mode === "edit" && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
              <div>
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {mode === "create" ? "Create" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};