import LinkButton from "../LinkButton";
import { getExportJobLink } from "../../lib/exportJobHelpers";
import { ExportJobSummary, ExportJobStatus } from "../../types";

type ExportJobActionProps = {
  job: ExportJobSummary;
  status: ExportJobStatus;
};

export default function ExportJobAction({ job, status }: ExportJobActionProps) {
  const link = `${process!.env!.REACT_APP_EHI_SERVER}/jobs/${
    job.id
  }/customize?_patient=${job.patient.id}&redirect=${
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
      return <LinkButton to={getExportJobLink(job.id)}>Download</LinkButton>;

    case "requested":
    case "in-review":
    case "aborted":
    case "rejected":
      return null;
  }
}
