import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"; 

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("notifications/my")
      .then((res) => {
        console.log("Fetched notifications:", res.data);
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications", err);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    // Check if the link is a shared collection link
    if (link.includes('/collections/') || link.includes('/shared-page/')) {
      // Extract the path and navigate to it
      const url = new URL(link);
      navigate(url.pathname);
    } else {
      // For other links, use default behavior
      window.location.href = link;
    }
  };

  return (
    <div className="container mt-5">
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <div className="list-group">
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`list-group-item ${notification.is_read ? "list-group-item-light" : "list-group-item-warning"}`}
              >
                <div>
                  <strong>{notification.sender_username}</strong> {notification.message}
                </div>
                <div>
                  <a 
                    href={notification.link} 
                    onClick={(e) => handleLinkClick(e, notification.link)}
                    className="link-primary"
                  >
                    Go to page
                  </a>
                </div>
                <div>
                  <small>{new Date(notification.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;