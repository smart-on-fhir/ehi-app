import { deleteExportJob } from "../../api/patientApiHandlers";
import { useNotificationContext } from "../../context/notificationContext";
import Button from "../generic/Button";

type DeleteExportJobButtonProps = {
  job: EHIApp.PatientExportJob;
  refreshJobs: (requestOptions?: RequestInit) => Promise<void>;
  ignoreError?: boolean;
};

export default function DeleteExportJobButton({
  job,
  refreshJobs,
  ignoreError = false,
}: DeleteExportJobButtonProps) {
  const { createNotification } = useNotificationContext();
  const { id } = job;
  return (
    <Button
      variant="danger"
      className="min-w-fit"
      onClick={async () => {
        await deleteExportJob(id)
          .then(() => {
            createNotification({
              title: `Successfully deleted job '${id}'.`,
              variant: "success",
            });
          })
          .catch(
            (err: Error) =>
              // Create a notification unless ignoreError is true
              !ignoreError &&
              createNotification({
                title: `Error deleting job '${id}'.`,
                errorMessage: err.message,
                variant: "error",
              })
          );
        refreshJobs();
      }}
    >
      Delete Now
    </Button>
  );
}
