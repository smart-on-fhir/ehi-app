import Button from "../Button";
import { ExportJob } from "../../types";
import {
  updateExportStatus,
  deleteExportJob,
} from "../../lib/exportJobHelpers";
import { operationOutcomeSummary } from "../../lib/fhirHelpers";
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
      .then((operationOutcome: fhir4.OperationOutcome) => {
        // If we have operationOutcome information, use it
        if (
          operationOutcome?.issue[0]?.severity &&
          operationOutcome?.issue[0]?.diagnostics
        ) {
          console.log(operationOutcomeSummary(operationOutcome));
        }
      })
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
      case "retrieved":
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
