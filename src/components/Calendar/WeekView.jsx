import React, { useState } from "react";
import { useCalendar } from "../../context/CalendarContext";
import { useEvents } from "../../context/EventContext";
import { 
  eachDayOfInterval, 
  format, 
  getHours,
  getMinutes, 
  isSameDay, 
  isToday,
  differenceInMinutes,
} from "date-fns";
import { EventDialog } from "./EventDialog";

export const WeekView = () => {
  const { visibleRange } = useCalendar();
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  // Generate the days of the week based on the visible range
  const days = eachDayOfInterval({
    start: visibleRange.start,
    end: visibleRange.end,
  });
  
  // Generate the hours of the day (24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getDayEvents = (day) => {
    return events.filter(event => isSameDay(event.start, day));
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
      {/* Day headers */}
      <div className="d-flex border-bottom border-light">
        <div className="time-column"></div>
        {days.map((day) => (
          <div 
            key={day.toISOString()} 
            className={`flex-1 py-2 text-center border-end border-light ${isToday(day) ? 'bg-light' : ''}`}
          >
            <div className="small text-uppercase text-muted">
              {format(day, "EEE")}
            </div>
            <div className={`day-number mx-auto mt-1 ${isToday(day) ? 'current-day' : ''}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}
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
          
          {/* Day columns */}
          {days.map((day) => (
            <div 
              key={day.toISOString()} 
              className={`day-column ${isToday(day) ? 'bg-light' : ''}`}
            >
              {/* Hour gridlines */}
              {hours.map((hour) => (
                <div 
                  key={hour}
                  className="hour-line" 
                  style={{ top: `${hour * 60}px` }}
                />
              ))}
              
              {/* Events */}
              {getDayEvents(day).map((event) => {
                const { top, height } = calculateEventPosition(event);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="calendar-event"
                    style={{
                      top,
                      height,
                      left: '4px',
                      right: '4px',
                      backgroundColor: event.color || "#039be5",
                    }}
                  >
                    <div className="event-title">{event.title}</div>
                    {parseInt(height) > 30 && (
                      <div className="event-location">{event.location}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
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