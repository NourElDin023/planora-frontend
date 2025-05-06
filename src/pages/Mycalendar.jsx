import React, { useState, useEffect } from "react";
import { Calendar } from "../components/Calendar/calendar";
import { CalendarProvider } from "../context/CalendarContext";
import { EventProvider } from "../context/EventContext";

const Index = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

  return (
    <div className={`calendar-page ${theme}`} style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <CalendarProvider>
        <EventProvider>
          <Calendar />
        </EventProvider>
      </CalendarProvider>
    </div>
  );
};

export default Index;