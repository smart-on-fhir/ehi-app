import { ExportJobStatus } from "../../types";
import {
  Edit, // awaiting-input`
  BookOpen, // in-review`
  Clock, // requested`
  CheckCircle, // retrieved`
  XOctagon, // aborted`
  Slash, // rejected`
} from "react-feather";

function displayStatus(status: ExportJobStatus) {
  return status.split("-").join(" ");
}

export default function ExportJobStatusIndicator({
  status,
  size,
}: {
  status: ExportJobStatus;
  size?: string | number;
}) {
  switch (status) {
    case "awaiting-input":
      return (
        <div
          className="rounded-full bg-yellow-200 "
          title={displayStatus(status)}
        >
          <Edit className="m-2" size={size} />
        </div>
      );
    case "requested":
      return (
        <div
          className="rounded-full bg-yellow-400  "
          title={displayStatus(status)}
        >
          <Clock className="m-2" size={size} />
        </div>
      );
    case "in-review":
      return (
        <div
          className="rounded-full bg-blue-300 "
          title={displayStatus(status)}
        >
          <BookOpen className="m-2 " size={size} />
        </div>
      );
    case "approved":
      return (
        <div
          className="rounded-full bg-green-400 "
          title={displayStatus(status)}
        >
          <CheckCircle className="m-2" size={size} />
        </div>
      );
    case "aborted":
      return (
        <div className="rounded-full bg-red-200 " title={displayStatus(status)}>
          <XOctagon className="m-2" size={size} />
        </div>
      );
    case "rejected":
      return (
        <div
          className="rounded-full bg-red-400   "
          title={displayStatus(status)}
        >
          <Slash className="m-2" size={size} />
        </div>
      );
    default:
      return <p>Unknown Export status</p>;
  }
}
