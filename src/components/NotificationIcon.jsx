import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial unread count
    axios.get('notifications/unread_count/')
      .then(res => setUnreadCount(res.data.unread_count));

    // // Setup WebSocket
    // const ws = new WebSocket('ws://127.0.0.1:8000/ws/notification/broadcast/');  
    
    // ws.onmessage = (e) => {
    //   const notification = JSON.parse(e.data);
    //   setUnreadCount(prev => prev + 1);
    //   setPopupMessage(notification);
    //   setShowPopup(true);
    //   setTimeout(() => setShowPopup(false), 5000);
    //   setNotifications(prev => [notification, ...prev]);
    // };

    // return () => ws.close();
  }, []);

  const handleIconClick = () => {
    // Mark as read and navigate to notifications page
    axios.post('notifications/mark_as_read/')
      .then(() => {
        setUnreadCount(0);
        navigate('/notifications');
      });
  };

  return (
    <div className="notification-icon">
      <button onClick={handleIconClick}>
        🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>

      {showPopup && (
        <div className="popup">
          {popupMessage.message}
          <button onClick={() => setShowPopup(false)}>×</button>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;