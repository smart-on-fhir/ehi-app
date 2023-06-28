import LinkButton from "../generic/LinkButton";
import { getExportJobLink } from "../../lib/exportJobHelpers";

type ExportJobActionProps = {
  job: EHIApp.ExportJob;
  status: EHIApp.ExportJobStatus;
};

export default function ExportJobAction({ job, status }: ExportJobActionProps) {
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

    case "approved":
      return (
        <LinkButton download target="_blank" to={getExportJobLink(job.id)}>
          Download
        </LinkButton>
      );

    case "requested":
    case "in-review":
    case "aborted":
    case "rejected":
      return null;
  }
}
