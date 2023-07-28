import { useEffect } from "react";
import { UnauthorizedError } from "../lib/errors";
import useAuthConsumer from "../context/authContext";
import { useNotificationContext } from "../context/notificationContext";

export function useUnauthorizedErrorCheck(error: Error | null) {
  const { navigateToLogin, localLogout } = useAuthConsumer();
  const { createNotification } = useNotificationContext();

  // If we have an UnauthorizedError, we should redirect to the login page
  useEffect(() => {
    if (error instanceof UnauthorizedError) {
      localLogout();
      navigateToLogin();
      createNotification({
        title: `Session expired, please log in again.`,
        variant: "warning",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
}
