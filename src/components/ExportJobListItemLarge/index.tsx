import { useNavigate } from "react-router";
import { ExportJob } from "../../types";
import Button from "../Button";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";

export default function ExportJobListItemLarge({ job }: { job: ExportJob }) {
  const navigate = useNavigate();
  return (
    <li className="flex items-center space-x-4  p-4 ">
      <div className="flex flex-col items-center text-center">
        <ExportJobStatusIndicator status={job.status} />
        <p className="text-xs">{job.status.split("-").join(" ")}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Job #{job.id}</h1>
          <pre className="whitespace-pre-wrap text-xs italic opacity-50">
            {[
              `Patient ${job.patientId}`,
              `Created ${new Date(job.createdAt).toLocaleString()}`,
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
    </li>
  );
}
