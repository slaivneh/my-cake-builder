import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../../services/notificationService';
import './Notification.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userId = 'user123'; // Mock user ID

  const fetchNotifications = () => {
    notificationService.getByUser(userId).then(data => {
      setNotifications(data);
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

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    await notificationService.markAsRead(id);
    fetchNotifications(); // Refresh list
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <div 
        className="bell-icon-container" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

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
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-time">{new Date(notif.date).toLocaleString('vi-VN')}</div>
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
