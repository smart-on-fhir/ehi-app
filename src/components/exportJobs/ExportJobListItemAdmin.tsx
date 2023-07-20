import LinkButton from "../generic/LinkButton";
import ExportJobStatusIndicatorAdmin from "./ExportJobStatusIndicatorAdmin";
import ExportJobStatusBlurbAdmin from "./ExportJobStatusBlurbAdmin";
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
        <ExportJobStatusIndicatorAdmin status={status} />
        <div className="text-sm opacity-80">
          <ExportJobStatusBlurbAdmin status={status} />
        </div>
      </div>
      <div className="w-full">
        <h1 className="mr-2 inline-flex items-center text-lg font-bold">
          Job #{id}{" "}
        </h1>
        <pre className="whitespace-pre-wrap text-xs italic opacity-50">
          {[
            displayPatientInformation(job),
            displayCreatedDate(job),
            `${attachments.length} Attachments`,
          ].join("\n")}
        </pre>
      </div>
      <LinkButton className="w-24" to={`/admin/jobs/${id}`}>
        {status === "retrieved" ? "Review" : "Details"}
      </LinkButton>
    </li>
  );
}
