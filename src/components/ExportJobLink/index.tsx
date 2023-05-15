import { ExportJob } from "../../types";
import { getExportJobLink } from "../../lib/exportJobHelpers";

type ExportJobLinkProps = {
  jobId: ExportJob["id"];
};

export default function ExportJobLink({ jobId }: ExportJobLinkProps) {
  return (
    <a
      href={getExportJobLink(jobId)}
      className="inline-flex items-center text-blue-600"
    >
      <p className="mr-2 inline-block">Download</p>
    </a>
  );
}
