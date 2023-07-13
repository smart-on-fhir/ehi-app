import LinkButton from "../generic/LinkButton";
import { getExportJobLink, abortExportJob } from "../../api/patientApiHandlers";
import Button from "../generic/Button";
import { getCustomizeUrl } from "../../lib/jobHelpers";

type ExportJobActionProps = {
  job: EHIApp.PatientExportJob;
  status: EHIApp.PatientExportJobStatus;
  refreshJobs: (signal?: AbortSignal | undefined) => Promise<void>;
};

export default function ExportJobAction({
  job,
  status,
  refreshJobs,
}: ExportJobActionProps) {
  switch (status) {
    case "awaiting-input":
      return (
        <LinkButton className="min-w-fit" to={getCustomizeUrl(job)}>
          Complete Form
        </LinkButton>
      );

    case "requested":
      return (
        <Button
          onClick={async () => {
            await abortExportJob(job.id);
            refreshJobs();
          }}
        >
          Abort
        </Button>
      );

    case "approved":
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

    case "deleted":
    case "aborted":
      return null;
  }
}
