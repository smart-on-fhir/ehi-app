import { useNavigate } from "react-router";
import { ExportJob } from "../../types";
import Button from "../Button";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";

export default function ExportJobCard({ job }: { job: ExportJob }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-4 border border-t-0 p-4 first:border-t only:border">
      <ExportJobStatusIndicator status={job.status} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Job #{job.id}</h1>
          <pre className="whitespace-pre-wrap text-xs italic opacity-50">
            {[
              `Patient ${job.patientId}`,
              new Date(job.createdAt).toLocaleString(),
              `${job.attachments.length} Attachments`,
            ].join("\n")}
          </pre>
        </div>
        <Button
          className="w-24"
          onClick={() => navigate(`/admin/job/${job.id}`)}
        >
          Details
        </Button>
      </div>
    </div>
  );
}
