import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobParametersAuthorizations from "../ExportJobParametersAuthorizations";
import ExportApproveButton from "../ExportApproveButton";
import ExportRejectButton from "../ExportRejectButton";
import AttachmentSection from "../AttachmentSection";
import ExportJobLink from "../ExportJobLink";
import { ExportJob } from "../../types";
import { Link } from "react-router-dom";

type ExportJobDetailViewProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function ExportJobDetailView({
  job,
  refreshJob,
}: ExportJobDetailViewProps) {
  return (
    <>
      <Link to="/admin/jobs" className="mb-2 block">
        ◀ Back to Export List
      </Link>
      <section className="h-[calc(100vh-112px)] rounded border bg-white p-4">
        <header className="mb-4 flex items-center">
          <div className="flex w-24 flex-col items-center text-center">
            <ExportJobStatusIndicator status={job.status} />
            <p className="text-xs">{job.status.split("-").join(" ")}</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <div>
              <h1 className="mr-2 inline-block text-lg font-bold">
                Job #{job.id}
              </h1>
              {job.status === "retrieved" && <ExportJobLink jobId={job.id} />}
              <pre className="whitespace-pre-wrap text-xs italic opacity-50">
                {[
                  `Patient ${job.patientId}`,
                  `Created ${new Date(job.createdAt).toLocaleString()}`,
                  `${job.attachments.length} Attachments`,
                ].join("\n")}
              </pre>
            </div>
          </div>
          <div className="flex space-x-2">
            <ExportRejectButton job={job} refreshJob={refreshJob} />
            <ExportApproveButton job={job} refreshJob={refreshJob} />
          </div>
        </header>
        <div className="space-y-4">
          <ExportJobParametersAuthorizations job={job} />
          <AttachmentSection job={job} refreshJob={refreshJob} />
        </div>
      </section>
    </>
  );
}
