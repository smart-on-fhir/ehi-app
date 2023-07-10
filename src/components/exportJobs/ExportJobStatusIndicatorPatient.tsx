import {
  // requested`
  Loader,
  // approved`
  CheckCircle,
  // rejected`
  Slash,
} from "react-feather";

function displayStatus(status: EHIApp.ExportJobStatus) {
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
    // Still waiting for actions on the patient-end
    case "requested":
      return (
        <div
          className="animate-spin-slow rounded-full bg-requested "
          title={displayStatus(status)}
        >
          <Loader className="m-2" size={size} />
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
