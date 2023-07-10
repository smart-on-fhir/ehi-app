import LinkButton from "../generic/LinkButton";
import ExportJobStatusIndicator from "./ExportJobStatusIndicator";
import ExportJobStatusBlurb from "./ExportJobStatusBlurb";
import ExportJobLink from "./ExportJobLink";
import {
  displayCreatedDate,
  displayPatientInformation,
} from "../../lib/jobHelpers";

export default function ExportJobListItemAdmin({
  job,
}: {
  job: EHIApp.ExportJob;
}) {
  const { id, status, attachments } = job;
  return (
    <li className="flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-20 flex-shrink-0 flex-col items-center text-center">
        <ExportJobStatusIndicator status={status} />
        <div className="text-sm opacity-80">
          <ExportJobStatusBlurb status={status} />
        </div>
      </div>
      <div className="w-full">
        <h1 className="mr-2 inline-flex items-center text-lg font-bold">
          Job #{id}{" "}
        </h1>
        {status === "retrieved" && <ExportJobLink jobId={id} />}
        <pre className="whitespace-pre-wrap text-xs italic opacity-50">
          {[
            displayPatientInformation(job),
            displayCreatedDate(job),
            `${attachments.length} Attachments`,
          ].join("\n")}
        </pre>
      </div>
      <LinkButton className="w-24" to={`/admin/jobs/${id}`}>
        {status === "in-review" ? "Review" : "Details"}
      </LinkButton>
    </li>
  );
}
