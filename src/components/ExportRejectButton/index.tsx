import Button from "../Button";
import { ExportJob } from "../../types";
import { updateExportStatus } from "../../lib/exportJobHelpers";

type RejectButtonProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function RejectButton({ job, refreshJob }: RejectButtonProps) {
  return (
    <Button
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
