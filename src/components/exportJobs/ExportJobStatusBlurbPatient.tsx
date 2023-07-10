type ExportJobStatusBlurbPatientProps = {
  status: EHIApp.PatientExportJobStatus;
};

export default function ExportJobStatusBlurbPatient({
  status,
}: ExportJobStatusBlurbPatientProps) {
  switch (status) {
    case "requested":
      return <p>Processing</p>;

    case "approved":
      return <p>Complete</p>;

    case "rejected":
      return <p>Rejected</p>;
  }
}
