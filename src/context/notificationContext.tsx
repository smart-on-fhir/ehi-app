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

// The full type corresponding to a notification object
export interface NotificationObject {
  // Unique ID for identifying a notification and its timeout in our lookups
  id: string;
  // Text to display in the notification
  title: string;
  // Optional error message for warning and error notifs
  errorMessage?: string;
  // Optional variant
  variant?: "information" | "warning" | "error" | "success";
}

// The data consumers provide when generating a notification
export type NotificationData = Omit<NotificationObject, "variant" | "id"> & {
  id?: NotificationObject["id"];
  variant?: NotificationObject["variant"];
};

export type NotificationLookup = Record<
  NotificationObject["id"],
  NotificationObject
>;
export type NotificationTimeoutLookup = Record<
  NotificationObject["id"],
  NodeJS.Timeout
>;

interface NotificationContextInterface {
  notifications: NotificationLookup;
  // When creating a notification, variants are optional
  createNotification: (notificationData: NotificationData) => void;
  deleteNotification: (id: NotificationObject["id"]) => void;
  setNotifications: Dispatch<SetStateAction<NotificationLookup>>;
  clearNotificationTimeout: (id: NotificationObject["id"]) => void;
  createNotificationTimeout: (id: NotificationObject["id"]) => void;
}

type NotificationProviderProps = {
  children: ReactNode;
};

const NotificationContext = createContext<NotificationContextInterface>(null!);
const NOTIF_DECAY_RATE = 7000;
// Only an internal representation for avoiding collisions, using incrementor as ID should be safe
let idCounter = 0;

export function NotificationProvider({ children }: NotificationProviderProps) {
  // A lookup storing our notifications
  const [notifications, setNotifications] = useState<NotificationLookup>({});

  // Create a new notification and track it in lookup
  function createNotification(notificationData: NotificationData) {
    const newNotifications = { ...notifications };
    // Increment id counter when we access it
    const notificationId = String(idCounter++);
    // Ensure notifications have a default variant set
    newNotifications[notificationId] = {
      variant: "information",
      id: notificationId,
      ...notificationData,
    };
    setNotifications(newNotifications);
  }

  // Remove a notification from our lookup by id, clearing its timeouts
  function deleteNotification(id: NotificationObject["id"]) {
    const newNotifications = { ...notifications };
    delete newNotifications[id];
    setNotifications(newNotifications);
  }

  // In addition to tracking the notification information, we need to create and decay them
  // A loopup storing all our notification timeouts
  const [notificationTimeoutMap, setNotificationTimeoutMap] =
    useState<NotificationTimeoutLookup>({});

  // Create and store a new timeout fn for a notification,
  const createNotificationTimeout = useCallback(
    (id: NotificationObject["id"]) => {
      // Anytime we create a new timeout, we should clear the old one
      if (notificationTimeoutMap[id]) {
        clearTimeout(notificationTimeoutMap![id]);
      }
      // Create a timeout for deleting this notification, track it in our map
      let tempTimeout = setTimeout(() => {
        deleteNotification(id);
      }, NOTIF_DECAY_RATE);
      setNotificationTimeoutMap({
        ...notificationTimeoutMap,
        [id]: tempTimeout,
      });
    },
    [notificationTimeoutMap, notifications]
  );

  // Clear a given notification's decay timeout
  const clearNotificationTimeout = useCallback(
    (id: NotificationObject["id"]) => {
      if (notificationTimeoutMap) {
        const newNotificationTimeoutMap = { ...notificationTimeoutMap };
        clearTimeout(newNotificationTimeoutMap[id]);
        delete newNotificationTimeoutMap[id];
        setNotificationTimeoutMap(newNotificationTimeoutMap);
      }
    },
    [notificationTimeoutMap, setNotificationTimeoutMap]
  );

  // Notifications decay after some time
  useEffect(() => {
    // For every notification we have, create a timeout
    if (notifications) {
      Object.values(notifications).map((notification) =>
        createNotificationTimeout(notification.id)
      );
    }
    return () => {
      if (notifications) {
        Object.values(notifications).map((notification) =>
          clearNotificationTimeout(notification.id)
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        createNotification,
        deleteNotification,
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
