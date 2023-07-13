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
      .then(() => navigate("/admin/jobs"))
      .catch((err) => alert(err.message));
  }
  function deleteJob() {
    deleteExportJob(job.id)
      .then(() => navigate("/admin/jobs"))
      .catch((err) => alert(err.message));
  }
  function statusBasedButton() {
    switch (status) {
      case "retrieved":
        return <Button onClick={rejectJob}>Reject</Button>;
      case "awaiting-input":
      case "requested":
      case "approved":
      case "aborted":
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
