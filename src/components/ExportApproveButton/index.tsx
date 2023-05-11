import Button from "../Button";
import { ExportJob } from "../../types";
import { updateExportStatus } from "../../lib/exportJobHelpers";

type ApproveButtonProps = {
  job: ExportJob;
  disabled?: boolean;
  refreshJob: () => Promise<void>;
};

export default function ApproveButton({
  job,
  disabled,
  refreshJob,
}: ApproveButtonProps) {
  return (
    <Button
      disabled
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
}
