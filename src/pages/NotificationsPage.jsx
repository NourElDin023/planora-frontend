import React, { useEffect, useState } from "react";
import axios from "../utils/axios"; 

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      }
    );
  }, []);

//   const handleMarkAsRead = async (id) => {
//     try {
//       await axios.patch(`notifications/${id}/`, {
//         is_read: true,
//       });
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((notification) =>
//           notification.id === id ? { ...notification, is_read: true } : notification
//         )
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

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
                  <a href={notification.link} target="_blank" rel="noopener noreferrer" className="link-primary">
                    Go to page
                  </a>
                </div>
                <div>
                  <small>{new Date(notification.timestamp).toLocaleString()}</small>
                </div>
                {/* {!notification.is_read && (
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Mark as Read
                  </button>
                )} */}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
