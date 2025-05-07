import React, { useState, useEffect } from "react";
import { useEvents } from "../../context/EventContext";
import { format, addHours, setHours, setMinutes } from "date-fns";

export const EventDialog = ({ isOpen, onClose, mode, event }) => {
  const { addEvent, updateEvent, deleteEvent, loading } = useEvents();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addHours(new Date(), 1));
  const [color, setColor] = useState("#039be5");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  // Reset error when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen]);
  
  // Initialize form when dialog is opened or event changes
  useEffect(() => {
    if (mode === "edit" && event) {
      setTitle(event.title || "");
      setDetails(event.details || "");
      setStartDate(event.start || new Date());
      setEndDate(event.end || addHours(new Date(), 1));
      setColor(event.completed ? '#33b679' : (event.color || "#039be5"));
      setCompleted(event.completed || false);
    } else {
      setTitle("");
      setDetails("");
      setStartDate(new Date());
      setEndDate(addHours(new Date(), 1));
      setColor("#039be5");
      setCompleted(false);
    }
  }, [mode, event, isOpen]);
  
  // Update color when completion status changes
  useEffect(() => {
    // If task is marked as completed, always set color to green (#33b679)
    // Otherwise, keep the selected color
    if (completed) {
      setColor('#33b679'); // Green color
    } else if (event && !completed && color === '#33b679') {
      // Only reset color if we're unchecking and the current color is the "completed" green
      setColor(event.color || '#039be5');
    }
  }, [completed, event]);
  
  const validateForm = () => {
    // Validate that end time is not before start time
    if (endDate < startDate) {
      setError("End time cannot be before start time");
      return false;
    }
    
    // Validate title is not empty
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const eventData = {
        title,
        details,
        start: startDate,
        end: endDate,
        color,
        completed,
      };
      
      if (mode === "create") {
        await addEvent(eventData);
      } else if (mode === "edit" && event) {
        await updateEvent({ ...eventData, id: event.id });
      }
      
      onClose();
    } catch (err) {
      console.error("Error saving event:", err);
      setError(err.response?.data?.message || 'An error occurred while saving the event');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!event) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await deleteEvent(event.id);
      onClose();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.response?.data?.message || 'An error occurred while deleting the event');
    } finally {
      setIsSubmitting(false);
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
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose} 
              disabled={isSubmitting}
              style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title*</label>
                <input
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  required
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                    color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                    borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
                  }}
                />
              </div>
              
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Start Date*</label>
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
                    required
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                      color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                      borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
                    }}
                  />
                </div>
                
                <div className="col">
                  <label className="form-label">End Date*</label>
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
                    required
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                      color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                      borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
                    }}
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Start Time*</label>
                  <input
                    type="time"
                    className="form-control"
                    value={format(startDate, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      setStartDate(setMinutes(setHours(startDate, hours), minutes));
                    }}
                    required
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                      color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                      borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
                    }}
                  />
                </div>
                
                <div className="col">
                  <label className="form-label">End Time*</label>
                  <input
                    type="time"
                    className="form-control"
                    value={format(endDate, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      setEndDate(setMinutes(setHours(endDate, hours), minutes));
                    }}
                    required
                    style={{
                      backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                      color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                      borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
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
                  disabled={completed}
                  title={completed ? "Color is fixed to green when task is completed" : ""}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                    color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                    borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
                  }}
                >
                  {colorOptions.map((colorOption) => (
                    <option key={colorOption.value} value={colorOption.value}>
                      {colorOption.label}
                    </option>
                  ))}
                </select>
                {completed && (
                  <small className="text-muted" style={{ color: theme === 'dark' ? '#aaa' : '' }}>
                    Color is set to green for completed tasks
                  </small>
                )}
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="completed"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="completed">
                  Completed
                </label>
              </div>
              
              <div className="mb-3">
                <label htmlFor="details" className="form-label">Details</label>
                <textarea
                  id="details"
                  className="form-control"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Add details"
                  rows="3"
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--input-bg, #333)' : '',
                    color: theme === 'dark' ? 'var(--text-color, #fff)' : '',
                    borderColor: theme === 'dark' ? 'var(--border-color, #555)' : ''
                  }}
                />
              </div>
            </div>
            
            <div className="modal-footer justify-content-between" style={{ borderTopColor: 'var(--border-color, #dee2e6)' }}>
              {mode === "edit" && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              )}
              <div>
                <button 
                  type="button" 
                  className="btn btn-secondary me-2" 
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (mode === "create" ? 'Creating...' : 'Saving...') 
                    : (mode === "create" ? 'Create' : 'Save')
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};