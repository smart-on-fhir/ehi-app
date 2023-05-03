import { ExportJobSummary } from "../../types";
import LinkButton from "../LinkButton";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobLink from "../ExportJobLink";

export default function ExportJobListItemLarge({
  job,
}: {
  job: ExportJobSummary;
}) {
  return (
    <li className="flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-16 flex-col items-center text-center">
        <ExportJobStatusIndicator status={job.status} />
        <p className="text-xs">{job.status.split("-").join(" ")}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div id="job-metadata">
          <h1 className="mr-2 inline-block text-lg font-bold">Job #{job.id}</h1>
          <ExportJobLink jobId={job.id} />
          <pre className="whitespace-pre-wrap text-xs italic opacity-50">
            {[
              `Patient ${job.patientId}`,
              `Created ${new Date(job.createdAt).toLocaleString()}`,
              `${job.attachments.length} Attachments`,
            ].join("\n")}
          </pre>
        </div>
        <LinkButton className="w-24" to={`/admin/jobs/${job.id}`}>
          Details
        </LinkButton>
      </div>
    </li>
  );
}
