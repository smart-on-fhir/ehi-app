import { ExportJobStatus } from "../../types";
import {
  Edit, // awaiting-input`
  BookOpen, // in-review`
  Clock, // requested`
  CheckCircle, // retrieved`
  XOctagon, // aborted`
  Slash, // rejected`
} from "react-feather";

export default function ExportJobStatusIndicator({
  status,
}: {
  status: ExportJobStatus;
}) {
  function getStatusIcon(status: ExportJobStatus) {
    switch (status) {
      case "awaiting-input":
        return (
          <div className="rounded-full bg-yellow-200" title={status}>
            <Edit className="m-2" />
          </div>
        );
      case "in-review":
        return (
          <div className="rounded-full bg-yellow-500" title={status}>
            <BookOpen className="m-2 " />
          </div>
        );
      case "requested":
        return (
          <div className="rounded-full bg-emerald-300" title={status}>
            <Clock className="m-2" />
          </div>
        );
      case "retrieved":
        return (
          <div className="rounded-full bg-emerald-500" title={status}>
            <CheckCircle className="m-2" />
          </div>
        );
      case "aborted":
        return (
          <div className="rounded-full bg-red-300" title={status}>
            <XOctagon className="m-2" />
          </div>
        );
      case "rejected":
        return (
          <div className="rounded-full bg-red-500" title={status}>
            <Slash className="m-2" />
          </div>
        );
      default:
        return <p>Unknown Export status</p>;
    }
  }
  return (
    <div className="flex flex-col items-center">
      {getStatusIcon("awaiting-input")}
      <p className="text-xs">{status.split("-").join(" ")}</p>
    </div>
  );
}
