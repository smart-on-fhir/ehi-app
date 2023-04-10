import { useNavigate } from "react-router";
import { ExportJob } from "../../types";
import Button from "../Button";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";

export default function ExportJobCard({ job }: { job: ExportJob }) {
  const navigate = useNavigate();
  return (
    <div className="grid columns-4 grid-flow-col items-center space-x-2 border p-4 first:border-b-0 last:border-t-0 only:border">
      <ExportJobStatusIndicator status={job.status} />
      <div className="col-span-2 mr-auto">
        <h1 className="text-lg font-bold">Job #{job.id}</h1>
        <p className="italic opacity-50">
          {[
            job.patientId,
            job.createdAt,
            `#${job.attachments.length} Attachments`,
          ].join(" // ")}
        </p>
      </div>
      <Button className="" onClick={() => navigate(`/admin/job/${job.id}`)}>
        Details
      </Button>
    </div>
  );
}
