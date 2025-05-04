import React, { createContext, useContext, useState, useEffect } from "react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, addDays, addMonths, addWeeks, format } from "date-fns";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");

  // Calculate visible date range based on current view and date
  const calculateVisibleRange = (date, viewType) => {
    if (viewType === "day") {
      const start = startOfDay(date);
      return { start, end: start };
    } else if (viewType === "week") {
      return {
        start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
        end: endOfWeek(date, { weekStartsOn: 0 }),
      };
    } else {
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    }
  };

  const [visibleRange, setVisibleRange] = useState(calculateVisibleRange(currentDate, view));

  // Update visible range when date or view changes
  useEffect(() => {
    setVisibleRange(calculateVisibleRange(currentDate, view));
  }, [currentDate, view]);

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToNext = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToPrev = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, -1));
    } else {
      setCurrentDate(addMonths(currentDate, -1));
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        view,
        setView,
        setCurrentDate,
        goToToday,
        goToNext,
        goToPrev,
        visibleRange,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};