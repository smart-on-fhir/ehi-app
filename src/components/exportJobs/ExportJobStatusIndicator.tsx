import {
  // awaiting-input`
  Edit,
  // requested`
  Loader,
  // in-review`
  Search,
  // approved`
  CheckCircle,
  // aborted`
  XOctagon,
  // rejected`
  Slash,
} from "react-feather";

function displayStatus(status: EHIApp.ExportJobStatus) {
  return status.split("-").join(" ");
}

export default function ExportJobStatusIndicator({
  status,
  size,
}: {
  status: EHIApp.ExportJobStatus;
  size?: string | number;
}) {
  switch (status) {
    case "awaiting-input":
      return (
        <div
          className="rounded-full bg-awaiting-input "
          title={displayStatus(status)}
        >
          <Edit className="m-2" size={size} />
        </div>
      );
    case "requested":
      return (
        <div
          className="animate-spin-slow rounded-full bg-requested "
          title={displayStatus(status)}
        >
          <Loader className="m-2" size={size} />
        </div>
      );
    case "in-review":
      return (
        <div
          className="rounded-full bg-in-review "
          title={displayStatus(status)}
        >
          <Search className="m-2 " size={size} />
        </div>
      );
    case "approved":
      return (
        <div
          className="rounded-full bg-green-400 text-white text-opacity-90 "
          title={displayStatus(status)}
        >
          <CheckCircle className="m-2" size={size} />
        </div>
      );
    case "aborted":
      return (
        <div className="rounded-full bg-aborted " title={displayStatus(status)}>
          <XOctagon className="m-2" size={size} />
        </div>
      );
    case "rejected":
      return (
        <div
          className="rounded-full bg-rejected text-white text-opacity-90 "
          title={displayStatus(status)}
        >
          <Slash className="m-2" size={size} />
        </div>
      );
    default:
      return <p className="text-sm">Unknown Export status</p>;
  }
}
