import { ExportJobSummary, ExportJobStatus } from "../../types";
import ExportJobLink from "../ExportJobLink";

type ExportJobBlurbProps = {
  job: ExportJobSummary;
  status: ExportJobStatus;
};

export default function ExportJobBlurb({ job, status }: ExportJobBlurbProps) {
  //   const created = job.createdAt ? new Date(job.createdAt) : null;
  //   const status = job.status;
  const link = `${process!.env!.REACT_APP_EHI_SERVER}/jobs/${
    job.id
  }/customize?_patient=${job.patientId}&redirect=${
    window.location.origin + window.location.pathname
  }`;

  function blurb() {
    switch (status) {
      case "awaiting-input":
        return (
          <a href={link} className="italic text-blue-600 underline">
            Awaiting Information
          </a>
        );

      case "in-review":
        return (
          <>
            Request In Review{" - "}
            <a href={link} className="italic text-blue-600 underline">
              Update Request
            </a>
          </>
        );

      case "requested":
        return "Export Processing";

      case "retrieved":
        return (
          <>
            Export Complete{" - "}
            <span className="italic underline">
              <ExportJobLink jobId={job.id} />
            </span>
          </>
        );

      case "aborted":
        return "Request Aborted";

      case "rejected":
        return "Request Rejected";
    }
  }

  return <p className="ml-2">{blurb()}</p>;
}
