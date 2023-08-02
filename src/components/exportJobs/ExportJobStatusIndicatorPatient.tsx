import {
  // awaiting-input`
  Edit,
  // requested`
  Loader,
  // approved`
  CheckCircle,
  // deleted`
  Slash,
} from "react-feather";

function displayStatus(status: EHIApp.PatientExportJobStatus) {
  return status.split("-").join(" ");
}

export default function ExportJobStatusIndicatorPatient({
  status,
  size,
}: {
  status: EHIApp.PatientExportJobStatus;
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
    case "requested":
      return (
        <div
          className="animate-spin-slow rounded-full bg-requested "
          title={displayStatus(status)}
        >
          <Loader className="m-2" size={size} />
        </div>
      );
    // Job is completed
    case "approved":
      return (
        <div
          className="rounded-full bg-green-400 text-white text-opacity-90 "
          title={displayStatus(status)}
        >
          <CheckCircle className="m-2" size={size} />
        </div>
      );
    // Job was deleted
    case "deleted":
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
