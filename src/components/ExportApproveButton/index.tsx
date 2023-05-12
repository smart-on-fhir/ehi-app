import Button from "../Button";
import { ExportJob } from "../../types";
import { updateExportStatus } from "../../lib/exportJobHelpers";

type ApproveButtonProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function ApproveButton({ job, refreshJob }: ApproveButtonProps) {
  const status = job.status;
  function buttonSwitch() {
    switch (status) {
      case "awaiting-input":
        return (
          <Button
            onClick={() =>
              updateExportStatus(job.id, "approve")
                .then(() => refreshJob())
                .catch((err) => alert(err.message))
            }
            variant="emphasized"
          >
            Approve
          </Button>
        );

      case "in-review":
        return (
          <Button
            onClick={() =>
              updateExportStatus(job.id, "approve")
                .then(() => refreshJob())
                .catch((err) => alert(err.message))
            }
            variant="emphasized"
          >
            Approve
          </Button>
        );

      case "requested":
      case "retrieved":
      case "aborted":
      case "rejected":
        return null;
    }
  }

  return buttonSwitch();
}
