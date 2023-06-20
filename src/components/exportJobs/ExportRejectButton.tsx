import Button from "../generic/Button";
import { ExportJob } from "../../types";
import {
  updateExportStatus,
  deleteExportJob,
} from "../../lib/exportJobHelpers";
import { useNavigate } from "react-router";

type RejectButtonProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function RejectButton({ job, refreshJob }: RejectButtonProps) {
  const navigate = useNavigate();
  const status = job.status;
  function rejectJob() {
    updateExportStatus(job.id, "reject")
      .then(() => refreshJob())
      .catch((err) => alert(err.message));
  }
  function deleteJob() {
    deleteExportJob(job.id)
      // Go back to the previous page since we've deleted the current job
      .then(() => navigate(-1))
      .catch((err) => alert(err.message));
  }
  function statusBasedButton() {
    switch (status) {
      case "awaiting-input":
      case "in-review":
        return <Button onClick={rejectJob}>Reject</Button>;
      case "requested":
        return (
          <Button
            variant="danger"
            className="w-28"
            disabled
            onClick={deleteJob}
          >
            Delete Now
          </Button>
        );
      case "approved":
      case "aborted":
      case "rejected":
        return (
          <Button variant="danger" className="w-28" onClick={deleteJob}>
            Delete Now
          </Button>
        );
    }
  }
  return statusBasedButton();
}
