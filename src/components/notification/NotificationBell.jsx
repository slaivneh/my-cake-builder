import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';
import './Notification.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const currentUser = user;
  const userId = currentUser?.id || 4; // TODO: Fallback 4 for testing, Member 3 will provide AuthContext

  const fetchNotifications = () => {
    if (!userId) return;
    notificationService.getByUser(userId)
      .then(data => {
        setNotifications(data);
      })
      .catch(err => {
        console.error("Error fetching notifications:", err);
      });
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications();

    // Polling every 10 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen) {
      const unreadNotifs = notifications.filter(n => !n.isRead);
      if (unreadNotifs.length > 0) {
        // Update UI immediately
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        // Sync with database
        Promise.all(unreadNotifs.map(n => notificationService.markAsRead(n.id)))
          .catch(err => console.error("Error marking all as read:", err));
      }
    }
  };


  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      {userId && (
        <div
          className="bell-icon-container"
          onClick={handleBellClick}
        >
          <span className="bell-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
      )}

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Thông Báo</h4>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">Không có thông báo nào.</p>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                >
                  <div className="notif-content">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-message">{notif.content || notif.message}</div>
                    <div className="notif-time">{new Date(notif.createdAt || notif.date).toLocaleString('vi-VN')}</div>
                  </div>
                  {!notif.isRead && (
                    <button
                      className="mark-read-btn"
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Đánh dấu đã đọc"
                    >
                      ●
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
