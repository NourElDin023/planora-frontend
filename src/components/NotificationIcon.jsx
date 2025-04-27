import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const navigate = useNavigate();
  const prevCountRef = useRef(0);
  const latestNotificationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const pollInterval = 5000;

    const fetchUnreadCount = () => {
      axios.get('notifications/unread_count/')
        .then(res => {
          if (isMounted) {
            const newCount = res.data.unread_count;
            
            // Fetch actual notifications when count increases
            if (newCount > prevCountRef.current) {
              axios.get('notifications/my/')
                .then(notificationsRes => {
                  const unreadNotifications = notificationsRes.data
                    .filter(n => !n.is_read)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                  
                  if (unreadNotifications.length > 0) {
                    const latest = unreadNotifications[0];
                    latestNotificationRef.current = latest;
                    setPopupMessage({ 
                      message: `${latest.message}`
                    });
                    setShowPopup(true);
                    setTimeout(() => setShowPopup(false), 3000);
                  }
                })
                .catch(console.error);
            }
            
            setUnreadCount(newCount);
            prevCountRef.current = newCount;
          }
        })
        .catch(error => console.error('Polling error:', error))
        .finally(() => {
          if (isMounted) {
            setTimeout(fetchUnreadCount, pollInterval);
          }
        });
    };

    fetchUnreadCount();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleIconClick = () => {
    axios.post('notifications/mark_as_read/')
      .then(() => {
        setUnreadCount(0);
        prevCountRef.current = 0;
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