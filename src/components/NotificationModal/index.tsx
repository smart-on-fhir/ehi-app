import { createPortal } from "react-dom";
import { NotificationObject } from "../../types";
import { X } from "react-feather";

export default function NotificationModal({
  onClose,
  id,
  title,
  notification,
  variant,
}: {
  onClose: React.MouseEventHandler;
  id: string;
  title: string;
  notification: NotificationObject | null;
  variant: "warning" | "error";
}): JSX.Element | null {
  if (notification && notification.id === id) {
    let variantStyles = "";
    switch (variant) {
      case "warning":
        variantStyles = "bg-yellow-100";
        break;
      case "error":
        variantStyles = "bg-red-100";
        break;
    }
    return createPortal(
      <div
        className={`absolute bottom-0 right-0 m-4 max-w-screen-sm break-words rounded border p-4 pr-8 text-sm ${variantStyles}`}
      >
        <p>{title}</p>
        <pre className="whitespace-pre-wrap">{notification.message}</pre>
        <button
          className="absolute right-0 top-0 border-b border-l  border-dashed p-1"
          onClick={onClose}
        >
          <X size={12} aria-label="Close" />
          <span className="sr-only">Close notification</span>
        </button>
      </div>,
      document.body
    );
  } else {
    return null;
  }
}