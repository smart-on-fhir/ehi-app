import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { NotificationObject } from "../types";

interface NotificationContextInterface {
  notification: NotificationObject | null;
  setNotification: Dispatch<SetStateAction<NotificationObject | null>>;
}

type NotificationProviderProps = {
  children: ReactNode;
};

let NotificationContext = createContext<NotificationContextInterface>(null!);

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationObject | null>(
    null
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (notification) {
      timeout = setTimeout(() => setNotification(null), 4000);
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
