import { ExportJobStatus } from "../../types";
import {
  Edit,
  BookOpen,
  Clock,
  CheckCircle,
  XOctagon,
  Slash,
} from "react-feather";

// awaiting-input` - Edit
// in-review` - BookOpen
// requested` - Clock
// retrieved` - CheckCircle
// aborted` - XOctagon
// rejected` - Slash
export default function ExportJobStatusIndicator({
  status,
}: {
  status: ExportJobStatus;
}) {
  function getStatusIcon(status: ExportJobStatus) {
    switch (status) {
      case "awaiting-input":
        return (
          <div className="rounded-full bg-yellow-200">
            <Edit className="m-2" />
          </div>
        );
      case "in-review":
        return (
          <div className="rounded-full bg-yellow-500">
            <BookOpen className="m-2 " />
          </div>
        );
      case "requested":
        return (
          <div className="rounded-full bg-emerald-300">
            <Clock className="m-2" />
          </div>
        );
      case "retrieved":
        return (
          <div className="rounded-full bg-emerald-500">
            <CheckCircle className="m-2" />
          </div>
        );
      case "aborted":
        return (
          <div className="rounded-full bg-red-300">
            <XOctagon className="m-2" />
          </div>
        );
      case "rejected":
        return (
          <div className="rounded-full bg-red-500">
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
      <p className="text-xs">{status}</p>
    </div>
  );
}
