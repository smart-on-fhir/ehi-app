import Button from "../generic/Button";
import {
  updateExportStatus,
  deleteExportJob,
} from "../../api/adminApiHandlers";
import { useNavigate } from "react-router";

type RejectButtonProps = {
  job: EHIApp.ExportJob;
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function RejectButton({ job, updateJob }: RejectButtonProps) {
  const navigate = useNavigate();
  const status = job.status;
  function rejectJob() {
    updateExportStatus(job.id, "reject")
      .then((job) => updateJob(job))
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
      case "retrieved":
        return <Button onClick={rejectJob}>Reject</Button>;
      case "awaiting-input":
      case "requested":
        return (
          <Button
            variant="danger"
            className="w-28"
            disabled
            onClick={rejectJob}
          >
            Reject
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
