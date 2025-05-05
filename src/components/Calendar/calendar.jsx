import React from "react";
import { useCalendar } from "../../context/CalendarContext";
import { CalendarHeader } from "./calendarHeader";
import { CalendarSidebar }  from "./calendarsidebar";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { DayView } from "./dayView";
import { useIsMobile } from "../../assets/use-mobile";
import "./calendar.css";

export const Calendar = () => {
  const { view } = useCalendar();
  const isMobile = useIsMobile();
  
  const renderView = () => {
    switch (view) {
      case "day":
        return <DayView />;
      case "week":
        return <WeekView />;
      case "month":
        return <MonthView />;
      default:
        return <WeekView />;
    }
  };
  
  return (
    <div className="calendar-container">
      <CalendarHeader />
      <div className="calendar-body">
        {!isMobile && <CalendarSidebar />}
        <main className="calendar-main">
          {renderView()}
        </main>
      </div>
    </div>
  );
};