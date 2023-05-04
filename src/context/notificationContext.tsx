import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface NotificationObject {
  // Unique ID for linking this notif with the consumer who wants to present a modal
  id: string;
  // Text to display in the notification
  title: string;
  // Optional error message for warning and error notifs
  errorMessage?: string;
}

interface NotificationContextInterface {
  notification: NotificationObject | null;
  setNotification: Dispatch<SetStateAction<NotificationObject | null>>;
  clearNotificationTimeout: () => void;
  createNotificationTimeout: () => void;
}

type NotificationProviderProps = {
  children: ReactNode;
};

const NotificationContext = createContext<NotificationContextInterface>(null!);
const NOTIF_DECAY_RATE = 7000;

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationObject | null>(
    null
  );
  const [notificationTimeout, setNotificationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Create and store a timeout fn for our notification
  const createNotificationTimeout = useCallback(() => {
    // Anytime we create a new timeout, we should clear the old one
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    let tempTimeout = setTimeout(() => setNotification(null), NOTIF_DECAY_RATE);
    setNotificationTimeout(tempTimeout);
  }, [notificationTimeout, setNotificationTimeout]);

  // Clears any notification timeouts
  const clearNotificationTimeout = useCallback(() => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
      setNotificationTimeout(null);
    }
  }, [notificationTimeout, setNotificationTimeout]);

  // Notifications decay after some time
  useEffect(() => {
    if (notification) {
      createNotificationTimeout();
    }
    return () => {
      clearNotificationTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
        createNotificationTimeout,
        clearNotificationTimeout,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
