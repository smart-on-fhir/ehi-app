import Button from "../generic/Button";
import {
  updateExportStatus,
  deleteExportJob,
} from "../../api/adminApiHandlers";
import { useNavigate } from "react-router";
import { useNotificationContext } from "../../context/notificationContext";

type RejectButtonProps = {
  job: EHIApp.ExportJob;
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function RejectButton({ job, updateJob }: RejectButtonProps) {
  const navigate = useNavigate();
  const { createNotification } = useNotificationContext();
  const status = job.status;
  function rejectJob() {
    updateExportStatus(job.id, "reject")
      .then(() => navigate("/admin/jobs"))
      .then(() => {
        createNotification({
          title: `Successfully deleted job'${job.id}'.`,
          variant: "success",
        });
      })
      .catch((err) => {
        createNotification({
          title: `Unable to reject job '${job.id}' with error: `,
          errorMessage: err.message,
          variant: "error",
        });
      });
  }
  function deleteJob() {
    deleteExportJob(job.id)
      .then(() => navigate("/admin/jobs"))
      .then(() =>
        createNotification({
          title: `Successfully deleted job'${job.id}'.`,
          variant: "success",
        })
      )
      .catch((err) => {
        createNotification({
          title: `Unable to delete job '${job.id}' with error: `,
          errorMessage: err.message,
          variant: "error",
        });
      });
  }
  function statusBasedButton() {
    switch (status) {
      case "retrieved":
        return <Button onClick={rejectJob}>Reject</Button>;
      case "awaiting-input":
      case "requested":
      case "approved":
      case "rejected":
        return (
          <Button variant="danger" className="w-28" onClick={rejectJob}>
            Delete Now
          </Button>
        );
    }
  }
  return statusBasedButton();
}
