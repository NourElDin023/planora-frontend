import React, { useState } from "react";
import { useCalendar } from "../../context/CalendarContext";
import { useEvents } from "../../context/EventContext";
import { 
  format, 
  getHours,
  getMinutes, 
  isSameDay, 
  differenceInMinutes,
} from "date-fns";
import { EventDialog } from "./EventDialog";

export const DayView = () => {
  const { currentDate } = useCalendar();
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  // Generate the hours of the day (24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getDayEvents = () => {
    return events.filter(event => isSameDay(event.start, currentDate));
  };
  
  const calculateEventPosition = (event) => {
    const startHour = getHours(event.start);
    const startMinute = getMinutes(event.start);
    const top = startHour * 60 + startMinute;
    
    const duration = differenceInMinutes(event.end, event.start);
    
    return {
      top: `${top}px`,
      height: `${duration}px`,
    };
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };
  
  return (
    <div className="d-flex flex-column h-100 overflow-hidden">
      {/* Day header */}
      <div className="d-flex border-bottom border-light">
        <div className="time-column"></div>
        <div className="flex-1 py-2 text-center">
          <div className="fs-5 fw-medium">
            {format(currentDate, "EEEE")}
          </div>
          <div className="small text-muted">
            {format(currentDate, "MMMM d, yyyy")}
          </div>
        </div>
      </div>
      
      {/* Scrollable time grid */}
      <div className="flex-1 overflow-auto">
        <div className="d-flex position-relative" style={{ height: `${24 * 60}px` }}>
          {/* Time indicators */}
          <div className="time-column">
            {hours.map((hour) => (
              <div 
                key={hour} 
                className="time-marker" 
                style={{ top: `${hour * 60}px` }}
              >
                {hour === 0 ? "" : `${hour % 12 === 0 ? 12 : hour % 12} ${hour >= 12 ? 'PM' : 'AM'}`}
              </div>
            ))}
          </div>
          
          {/* Day column */}
          <div className="day-column">
            {/* Hour gridlines */}
            {hours.map((hour) => (
              <div 
                key={hour}
                className="hour-line" 
                style={{ top: `${hour * 60}px` }}
              />
            ))}
            
            {/* Events */}
            {getDayEvents().map((event) => {
              const { top, height } = calculateEventPosition(event);
              
              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="calendar-event"
                  style={{
                    top,
                    height,
                    left: '8px',
                    right: '8px',
                    backgroundColor: event.color || "#039be5",
                  }}
                >
                  <div className="event-title">{event.title}</div>
                  {parseInt(height) > 50 && (
                    <>
                      <div className="small">
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </div>
                      {event.location && (
                        <div className="small mt-1">{event.location}</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            
            {/* Current time indicator */}
            <div className="current-time" style={{ 
              top: `${getHours(new Date()) * 60 + getMinutes(new Date())}px` 
            }}>
              <div className="current-time-text">
                {format(new Date(), "h:mm a")}
              </div>
              <div className="current-time-line"/>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event dialog for editing */}
      {selectedEvent && (
        <EventDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          mode="edit"
          event={selectedEvent}
        />
      )}
    </div>
  );
};