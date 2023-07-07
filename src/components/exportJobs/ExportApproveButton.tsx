import Button from "../generic/Button";
import { updateExportStatus } from "../../lib/adminJobHelpers";

type ApproveButtonProps = {
  job: EHIApp.ExportJob;
  refreshJob: () => Promise<void>;
};

export default function ApproveButton({ job, refreshJob }: ApproveButtonProps) {
  const status = job.status;
  function approveJob() {
    updateExportStatus(job.id, "approve")
      .then(() => refreshJob())
      .catch((err) => alert(err.message));
  }
  function statusBasedButton() {
    switch (status) {
      case "in-review":
        return (
          <Button onClick={approveJob} variant="emphasized">
            Approve
          </Button>
        );

      case "awaiting-input":
      case "requested":
      case "retrieved":
      case "aborted":
      case "rejected":
        return null;
    }
  }

  return statusBasedButton();
}
