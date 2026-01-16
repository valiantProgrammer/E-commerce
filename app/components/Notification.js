'use client';

import React, { createContext, useContext, useState } from 'react';
import BunnyNotification from '../components/ui/BunnyNotification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'success', // 'success' or 'error'
    visible: false,
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification.visible && (
        <BunnyNotification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
