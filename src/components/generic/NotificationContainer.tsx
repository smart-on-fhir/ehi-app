import { createPortal } from "react-dom";
import {
  NotificationObject,
  useNotificationContext,
} from "../../context/notificationContext";
import { X, CheckCircle, Info, AlertCircle, XCircle } from "react-feather";

function NotificationIcon({
  variant,
}: {
  variant: NotificationObject["variant"];
}) {
  switch (variant) {
    case "success":
      return <CheckCircle />;
    case "information":
      return <Info />;
    case "warning":
      return <AlertCircle />;
    case "error":
      return <XCircle />;
    default:
      console.error("unexpected notification variant ", variant);
      return null;
  }
}

export default function NotificationContainer(): JSX.Element | null {
  const {
    notifications,
    deleteNotification,
    clearNotificationTimeout,
    createNotificationTimeout,
  } = useNotificationContext();

  if (!notifications) return null;
  return createPortal(
    <>
      {Object.entries(notifications).map(([id, notification], i) => {
        const onClose = () => deleteNotification(id);
        let variantStyles = "";
        switch (notification.variant) {
          case "information":
            variantStyles = "bg-blue-100";
            break;
          case "success":
            variantStyles = "bg-green-100";
            break;
          case "warning":
            variantStyles = "bg-yellow-100";
            break;
          case "error":
            variantStyles = "bg-red-100";
            break;
        }

        return (
          <div
            key={id}
            className={`absolute bottom-0 right-0 m-4 flex max-w-screen-md animate-fade-in items-center break-words rounded border p-4 pr-6 text-sm transition-all duration-1000 ${variantStyles}`}
            style={{ bottom: i * 80 }}
            onMouseEnter={() => clearNotificationTimeout(id)}
            onMouseLeave={() => createNotificationTimeout(id)}
          >
            <div className="mr-2 inline-block">
              <NotificationIcon variant={notification.variant} />
            </div>
            <div className="inline-block">
              <p>{notification.title}</p>
              {notification.errorMessage && (
                <pre className="whitespace-pre-wrap">
                  {notification.errorMessage}
                </pre>
              )}
            </div>
            <button
              className="absolute right-0 top-0 border-b border-l  border-dashed p-1"
              onClick={onClose}
            >
              <X size={12} aria-label="Close" />
              <span className="sr-only">Close notification</span>
            </button>
          </div>
        );
      })}
    </>,
    document.body
  );
}
