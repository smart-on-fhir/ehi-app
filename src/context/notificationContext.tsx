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
const NOTIF_DECAY_RATE = 2000;
// Only an internal representation for avoiding collisions, using incrementor as ID should be safe
let idCounter = 0;

export function NotificationProvider({ children }: NotificationProviderProps) {
  // A lookup storing our notifications
  const [notifications, setNotifications] = useState<NotificationLookup>({});

  // Create a new notification and track it in lookup
  function createNotification(notificationData: NotificationData) {
    setNotifications((prevNotifications) => {
      const newNotifications = { ...prevNotifications };
      // Increment id counter when we access it
      const notificationId = String(idCounter++);
      // Ensure notifications have a default variant set
      newNotifications[notificationId] = {
        variant: "information",
        id: notificationId,
        ...notificationData,
      };
      createNotificationTimeout(notificationId);
      return newNotifications;
    });
  }

  // Remove a notification from our lookup by id, clearing its timeouts
  function deleteNotification(id: NotificationObject["id"]) {
    setNotifications((prevNotifications) => {
      const newNotifications = { ...prevNotifications };
      delete newNotifications[id];
      return newNotifications;
    });
  }

  // In addition to tracking the notification information, we need to create and decay them
  // A loopup storing all our notification timeouts
  const [notificationTimeoutMap, setNotificationTimeoutMap] =
    useState<NotificationTimeoutLookup>({});

  // Create and store a new timeout fn for a notification,
  const createNotificationTimeout = useCallback(
    (id: NotificationObject["id"]) => {
      setNotificationTimeoutMap((prevNotificationTimeoutMap) => {
        // Anytime we create a new timeout, we should clear the old one
        if (prevNotificationTimeoutMap[id]) {
          clearTimeout(prevNotificationTimeoutMap![id]);
        }
        // Create a timeout for deleting this notification, track it in our map
        let tempTimeout = setTimeout(() => {
          deleteNotification(id);
        }, NOTIF_DECAY_RATE);
        return {
          ...prevNotificationTimeoutMap,
          [id]: tempTimeout,
        };
      });
    },
    []
  );

  // Clear a given notification's decay timeout
  const clearNotificationTimeout = useCallback(
    (id: NotificationObject["id"]) => {
      setNotificationTimeoutMap((prevNotificationTimeoutMap) => {
        const newNotificationTimeoutMap = { ...prevNotificationTimeoutMap };
        clearTimeout(newNotificationTimeoutMap[id]);
        delete newNotificationTimeoutMap[id];
        return newNotificationTimeoutMap;
      });
    },
    []
  );

  // // Notifications decay after some time
  // useEffect(() => {
  //   // For every notification we have, create a timeout
  //   if (notifications) {
  //     console.log("in notification container useeffect");
  //     console.log(notifications);
  //     Object.values(notifications).map((notification) =>
  //       createNotificationTimeout(notification.id)
  //     );
  //   }
  //   return () => {
  //     if (notifications) {
  //       console.log("in cleanup? ");

  //       Object.values(notifications).map((notification) =>
  //         clearNotificationTimeout(notification.id)
  //       );
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [notifications]);

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
