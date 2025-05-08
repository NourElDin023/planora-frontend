import React from "react";
import { useCalendar } from "../../context/CalendarContext";
import { format } from "date-fns";
import { useIsMobile } from "../../assets/use-mobile";

export const CalendarHeader = () => {
  const { currentDate, view, setView, goToToday, goToNext, goToPrev } = useCalendar();
  const isMobile = useIsMobile();

  const getHeaderTitle = () => {
    if (view === "day") {
      return format(currentDate, isMobile ? "MMM d" : "MMMM d, yyyy");
    } else if (view === "week") {
      return format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy");
    } else {
      return format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy");
    }
  };

  return (
    <header className="calendar-header">
      <div className="d-flex align-items-center gap-2">
        <div className="calendar-logo">
          <h1 className={`${isMobile ? 'h6' : 'h5'} mb-0`}>Planora Calendar</h1>
        </div>
        <div className={`calendar-controls ${isMobile ? 'ms-2' : 'ms-4'}`}>
          <button 
            className="btn btn-outline-secondary btn-sm" 
            onClick={goToToday}
          >
            Today
          </button>
          <div className="btn-group ms-2">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={goToPrev}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={goToNext}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
          <h2 className="calendar-title ms-2">{getHeaderTitle()}</h2>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3" >
        <select 
          className="form-select form-select-sm" 
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
    </header>
  );
};
