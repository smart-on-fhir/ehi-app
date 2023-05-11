// import { ExternalLink } from "react-feather";
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
      // aria-label="An external link to files associated with this job"
    >
      <p className="mr-2 inline-block">Download</p>
      {/* <ExternalLink size="16" className="inline-block" /> */}
    </a>
  );
}
