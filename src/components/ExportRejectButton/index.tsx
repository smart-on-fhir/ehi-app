import Button from "../Button";
import { ExportJob } from "../../types";
import { updateExportStatus } from "../../lib/exportJobHelpers";

type RejectButtonProps = {
  job: ExportJob;
  disabled?: boolean;
  refreshJob: () => Promise<void>;
};

export default function RejectButton({
  job,
  disabled,
  refreshJob,
}: RejectButtonProps) {
  return (
    <Button
      disabled
      onClick={() =>
        updateExportStatus(job.id, "reject")
          .then(() => refreshJob())
          .catch((err) => alert(err.message))
      }
    >
      Reject
    </Button>
  );
}
