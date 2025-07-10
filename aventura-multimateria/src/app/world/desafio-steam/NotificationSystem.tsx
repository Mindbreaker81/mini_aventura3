"use client";
import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, undefined = no auto-close
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const { id, type, title, message, duration, action } = notification;

  // Auto-close después del duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="text-green-600 flex-shrink-0" />;
      case 'error':
        return <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0" />;
      case 'info':
        return <Info size={24} className="text-blue-600 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border rounded-lg shadow-lg p-4 mb-3 animate-slide-in";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">
            {title}
          </h4>
          <p className="text-gray-700 text-sm mt-1">
            {message}
          </p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 underline"
            >
              {action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => onClose(id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onClose 
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
      {notifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Hook para manejar notificaciones
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options?.duration || (type === 'error' ? undefined : 4000), // Errores no se auto-cierran
      action: options?.action
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Funciones de conveniencia
  const showSuccess = (title: string, message: string, options?: { duration?: number }) => 
    addNotification('success', title, message, options);
  
  const showError = (title: string, message: string, action?: { label: string; onClick: () => void }) => 
    addNotification('error', title, message, { action });
  
  const showWarning = (title: string, message: string, options?: { duration?: number }) => 
    addNotification('warning', title, message, options);
  
  const showInfo = (title: string, message: string, options?: { duration?: number }) => 
    addNotification('info', title, message, options);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};