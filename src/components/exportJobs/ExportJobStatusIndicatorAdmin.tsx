import {
  // awaiting-input`
  Edit,
  // requested`
  Loader,
  // retrieved`
  Search,
  // approved`
  CheckCircle,
  // rejected`
  Slash,
} from "react-feather";

function displayStatus(status: EHIApp.ExportJobStatus) {
  return status.split("-").join(" ");
}

export default function ExportJobStatusIndicatorAdmin({
  status,
  size,
}: {
  status: EHIApp.ExportJobStatus;
  size?: string | number;
}) {
  switch (status) {
    // Waiting on form completion by the patient
    case "awaiting-input":
      return (
        <div
          className="rounded-full bg-awaiting-input "
          title={displayStatus(status)}
        >
          <Edit className="m-2" size={size} />
        </div>
      );
    // Bulk export is running
    case "requested":
      return (
        <div
          className="animate-spin-slow rounded-full bg-requested "
          title={displayStatus(status)}
        >
          <Loader className="m-2" size={size} />
        </div>
      );
    // Ready for review
    case "retrieved":
      return (
        <div
          className="rounded-full bg-retrieved "
          title={displayStatus(status)}
        >
          <Search className="m-2 " size={size} />
        </div>
      );
    // Approved by admin
    case "approved":
      return (
        <div
          className="rounded-full bg-approved text-white text-opacity-90 "
          title={displayStatus(status)}
        >
          <CheckCircle className="m-2" size={size} />
        </div>
      );
    // Rejected by admin
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
