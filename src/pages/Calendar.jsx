import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';


const msalInstance = new PublicClientApplication({
    auth: {
        clientId: '2abbf8b1-bc62-4f94-b550-db926ae02de2', // Replace with your Azure App client ID
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost:8000/api/calendar/sync', // Replace with your app's redirect URI
    },
});

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMsalReady, setIsMsalReady] = useState(false);
    
    useEffect(() => {
        const initializeMsal = async () => {
            try {
                await msalInstance.initialize();
                setIsMsalReady(true);
            } catch (error) {
                console.error("Failed to initialize MSAL:", error);
            } finally {
                setLoading(false); // <-- This ensures the loading paragraph disappears
            }
        };

        initializeMsal();
    }, []);

    const fetchCalendarEvents = () => {
        // Step 2: Fetch the events if the user is connected
        axios.get('http://localhost:8000/api/calendar/events/', {
            withCredentials: true, // Ensure cookies/session are included
        })
            .then(res => {
                const formattedEvents = (res.data.value || []).map(event => ({
                    title: event.subject,
                    start: event.start.dateTime,
                    end: event.end.dateTime,
                }));
                setEvents(formattedEvents);
            })
            .catch(err => {
                console.log('Error fetching events:', err);
            });
    };

    const handleConnectClick = async () => {
        if (!isMsalReady) {
            console.log("MSAL not ready yet...");
            return;
        }
        try {
            const response = await msalInstance.loginPopup({
                scopes: ["User.Read", "Calendars.ReadWrite"],
            });

            const accessToken = response.accessToken;

            // Send the token to the backend for calendar sync
            const backendResponse = await fetch('http://localhost:8000/api/calendar/sync/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,  // Use the actual access token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessToken })
            });

            const data = await backendResponse.json();
            console.log('Backend Response:', data);

            // If calendar sync is successful, fetch events
            if (data.success) {
                setIsConnected(true);
                fetchCalendarEvents();
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Calendar</h1>

            {loading ? (
                <p>Loading...</p>
            ) : !isConnected ? (
                <button
                    onClick={handleConnectClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Connect Outlook Calendar
                </button>
            ) : (
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                />
            )}
        </div>
    );
};

export default CalendarPage;
