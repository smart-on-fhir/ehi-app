import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobStatusBlurb from "../ExportJobStatusBlurb";
import ExportJobParametersAuthorizations from "../ExportJobParametersAuthorizations";
import ExportApproveButton from "../ExportApproveButton";
import ExportRejectButton from "../ExportRejectButton";
import AttachmentSection from "../AttachmentSection";
import ExportJobLink from "../ExportJobLink";
import { ExportJob } from "../../types";

type ExportJobDetailViewProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function ExportJobDetailView({
  job,
  refreshJob,
}: ExportJobDetailViewProps) {
  const { id, status, patient, createdAt, attachments } = job;
  return (
    <section className="space-y-4 rounded border bg-white p-4">
      <header className="flex items-center">
        <div className="flex w-24 flex-col items-center pr-1 text-center">
          <ExportJobStatusIndicator status={status} />
          <div className="text-sm opacity-80">
            <ExportJobStatusBlurb status={status} />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="mr-2 inline-block text-lg font-bold">Job #{id}</h1>
            {status === "approved" && <ExportJobLink jobId={id} />}
            <pre className="whitespace-pre-wrap text-xs italic opacity-50">
              {[
                `Patient ${patient.name}`,
                `Created ${new Date(createdAt).toLocaleString()}`,
                `${attachments.length} Attachments`,
              ].join("\n")}
            </pre>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap justify-end space-x-0 space-y-2 sm:flex-nowrap sm:justify-normal sm:space-x-2 sm:space-y-0">
          <ExportRejectButton job={job} refreshJob={refreshJob} />
          <ExportApproveButton job={job} refreshJob={refreshJob} />
        </div>
      </header>
      <ExportJobParametersAuthorizations job={job} />
      <AttachmentSection job={job} refreshJob={refreshJob} />
    </section>
  );
}
