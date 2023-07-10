type ExportJobStatusBlurbAdminProps = {
  status: EHIApp.ExportJobStatus;
};

export default function ExportJobStatusBlurbAdmin({
  status,
}: ExportJobStatusBlurbAdminProps) {
  switch (status) {
    case "awaiting-input":
      return <p>Information Needed</p>;

    case "retrieved":
      return <p>In Review</p>;

    case "requested":
      return <p>Processing</p>;

    case "approved":
      return <p>Complete</p>;

    case "aborted":
      return <p>Aborted</p>;

    case "rejected":
      return <p>Rejected</p>;
  }
}
