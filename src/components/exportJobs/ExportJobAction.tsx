import LinkButton from "../generic/LinkButton";
import { getExportJobLink, abortExportJob } from "../../lib/adminApiHandlers";
import Button from "../generic/Button";

type ExportJobActionProps = {
  job: EHIApp.ExportJob;
  status: EHIApp.ExportJobStatus;
  syncJobs: Function;
};

export default function ExportJobAction({
  job,
  status,
  syncJobs,
}: ExportJobActionProps) {
  const link = `${job.customizeUrl}&redirect=${
    window.location.origin + window.location.pathname
  }`;

  switch (status) {
    case "awaiting-input":
      return (
        <LinkButton className="min-w-fit" to={link}>
          Complete Form
        </LinkButton>
      );

    case "retrieved":
      return (
        <LinkButton
          className="min-w-fit"
          download
          target="_blank"
          to={getExportJobLink(job.id)}
        >
          Download
        </LinkButton>
      );

    case "in-review":
      return (
        <Button
          onClick={async () => {
            await abortExportJob(job.id);
            syncJobs();
          }}
        >
          Abort
        </Button>
      );
    case "requested":
    case "aborted":
    case "rejected":
      return null;
  }
}
