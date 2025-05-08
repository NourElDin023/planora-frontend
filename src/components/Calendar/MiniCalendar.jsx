import React from "react";
import { useCalendar } from "../../context/CalendarContext";
import { 
  addDays, 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  format, 
  getDay, 
  isEqual, 
  isSameMonth, 
  isToday, 
  startOfMonth, 
  startOfWeek 
} from "date-fns";

export const MiniCalendar = () => {
  const { currentDate, setCurrentDate } = useCalendar();
  
  // Get first day of the current month
  const firstDayOfMonth = startOfMonth(currentDate);
  
  // Get the days needed for a full calendar view
  const start = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start, end });
  
  // Previous and next month navigation
  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(previousMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(nextMonth);
  };
  
  // Day names
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  
  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <h2 className="mini-calendar-title">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="mini-calendar-controls">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="mini-calendar-button"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            className="mini-calendar-button"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="mini-calendar-grid mb-1">
        {dayNames.map((day, index) => (
          <div key={index} className="mini-calendar-day-name">
            {day}
          </div>
        ))}
      </div>
      
      <div className="mini-calendar-grid">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isEqual(day, currentDate);
          
          let className = "mini-calendar-day";
          if (isToday(day)) className += " mini-calendar-day-today";
          else if (isSelected) className += " mini-calendar-day-selected";
          if (!isCurrentMonth) className += " mini-calendar-day-other-month";
          
          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => setCurrentDate(day)}
              className={className}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};