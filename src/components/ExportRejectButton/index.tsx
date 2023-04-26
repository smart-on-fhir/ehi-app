import Button from "../Button";
import { ExportJob } from "../../types";
import { updateExportStatus } from "../../lib/exportJobHelpers";

export default function RejectButton({
  job,
  refreshJob,
}: {
  job: ExportJob;
  refreshJob: () => Promise<void>;
}) {
  return (
    <Button
      onClick={() => updateExportStatus(job, "reject").then(() => refreshJob())}
    >
      Reject
    </Button>
  );
}
