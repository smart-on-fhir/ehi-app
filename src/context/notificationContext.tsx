import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
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
}

type NotificationProviderProps = {
  children: ReactNode;
};

const NotificationContext = createContext<NotificationContextInterface>(null!);
const NOTIF_DECAY_RATE = 4000;

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationObject | null>(
    null
  );
  // Notifications decay after some time
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (notification) {
      timeout = setTimeout(() => setNotification(null), NOTIF_DECAY_RATE);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [notification, setNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
