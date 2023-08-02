type ExportJobStatusBlurbPatientProps = {
  status: EHIApp.PatientExportJobStatus;
};

export default function ExportJobStatusBlurbPatient({
  status,
}: ExportJobStatusBlurbPatientProps) {
  switch (status) {
    case "awaiting-input":
      return <p>Information Needed</p>;

    case "requested":
      return <p>Processing</p>;

    case "approved":
      return <p>Complete</p>;

    case "deleted":
      return <p>Deleted</p>;
  }
}
