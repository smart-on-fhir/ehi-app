import Button from "../generic/Button";
import { updateExportStatus } from "../../api/adminApiHandlers";
import { useNotificationContext } from "../../context/notificationContext";

type ApproveButtonProps = {
  job: EHIApp.ExportJob;
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function ApproveButton({ job, updateJob }: ApproveButtonProps) {
  const status = job.status;
  const { createNotification } = useNotificationContext();
  function approveJob() {
    updateExportStatus(job.id, "approve")
      .then((newJob) => updateJob(newJob))
      .catch((err) => {
        createNotification({
          title: `Unable to approve job '${job.id}' with error: `,
          errorMessage: err.message,
          variant: "error",
        });
      });
  }
  function statusBasedButton() {
    switch (status) {
      case "retrieved":
        return (
          <Button onClick={approveJob} variant="emphasized">
            Approve
          </Button>
        );

      case "awaiting-input":
      case "requested":
      case "approved":
      case "rejected":
        return null;
    }
  }

  return statusBasedButton();
}
