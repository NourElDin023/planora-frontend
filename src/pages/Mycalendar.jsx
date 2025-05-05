import { Calendar } from "../components/Calendar/calendar";
import { CalendarProvider } from "../context/CalendarContext";
import { EventProvider } from "../context/EventContext";

const Index = () => {
  return (
    <div className="calendar-page" style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <CalendarProvider>
        <EventProvider>
          <Calendar />
        </EventProvider>
      </CalendarProvider>
    </div>
  );
};

export default Index;