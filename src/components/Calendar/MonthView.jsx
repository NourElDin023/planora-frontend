import React, { useState } from "react";
import { useCalendar } from "../../context/CalendarContext";
import { useEvents } from "../../context/EventContext";
import { 
  eachDayOfInterval, 
  endOfMonth, 
  format, 
  isSameDay,
  isSameMonth, 
  isToday, 
  startOfMonth, 
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { EventDialog } from "./EventDialog";

export const MonthView = () => {
  const { currentDate, setCurrentDate } = useCalendar();
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const dayEvents = (day) => {
    return events.filter(event => isSameDay(event.start, day));
  };
  
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };
  
  return (
    <div className="flex-1 overflow-auto">
      <div className="month-grid month-day-names">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
          <div key={day}>{day.slice(0, 3)}</div>
        ))}
      </div>
      
      <div className="month-grid">
        {days.map(day => {
          const eventsOnDay = events.filter(event => isSameDay(event.start, day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          let dayClassName = "month-day";
          if (!isCurrentMonth) dayClassName += " bg-light";
          if (isToday(day)) dayClassName += " bg-info-subtle";
          
          return (
            <div 
              key={day.toISOString()}
              onClick={() => setCurrentDate(day)}
              className={dayClassName}
            >
              <div className={`month-day-number ${isToday(day) ? 'current-day' : ''}`}>
                {format(day, "d")}
              </div>
              
              <div>
                {eventsOnDay.slice(0, 3).map(event => (
                  <div 
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className="month-event"
                    style={{ backgroundColor: event.color || "#039be5" }}
                  >
                    {event.title}
                  </div>
                ))}
                
                {eventsOnDay.length > 3 && (
                  <div className="small text-muted ps-1">
                    +{eventsOnDay.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
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