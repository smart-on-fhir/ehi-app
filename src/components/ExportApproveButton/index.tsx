import Button from "../Button";
import { ExportJob } from "../../types";
import { updateExportStatus } from "../../lib/exportJobHelpers";

export default function ApproveButton({
  job,
  refreshJob,
}: {
  job: ExportJob;
  refreshJob: () => Promise<void>;
}) {
  return (
    <Button
      onClick={() =>
        updateExportStatus(job, "approve").then(() => refreshJob())
      }
      variant="primary"
    >
      Approve
    </Button>
  );
}
