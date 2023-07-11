import LinkButton from "../generic/LinkButton";
import { getExportJobLink, abortExportJob } from "../../api/patientApiHandlers";
import Button from "../generic/Button";
import { getCustomizeUrl } from "../../lib/jobHelpers";

type ExportJobActionProps = {
  job: EHIApp.PatientExportJob;
  status: EHIApp.PatientExportJobStatus;
  syncJobs: Function;
};

export default function ExportJobAction({
  job,
  status,
  syncJobs,
}: ExportJobActionProps) {
  /**
   * TODO: Figure out when if at all we should show this form? The IG implies we should be able to determine this case
   * based on the response of the status request check:
   * "If the EHI Server provided a patient interaction link in the Kick-off response and the
   * patient has not completed the form at that link, the EHI Server SHALL return
   * the same Link header as part of the status response (along with optional Retry-After and X-Progress
   * headers as described in the Async Pattern)"
   */
  // const link = `${job.customizeUrl}&redirect=${
  //   window.location.origin + window.location.pathname
  // }`;

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
            syncJobs();
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

    case "rejected":
    case "aborted":
      return null;
  }
}
