type ExportJobBlurbProps = {
  status: EHIApp.ExportJobStatus;
};

export default function ExportJobBlurb({ status }: ExportJobBlurbProps) {
  switch (status) {
    case "awaiting-input":
      return <p>Information Needed</p>;

    case "in-review":
      return <p>In Review</p>;

    case "requested":
      return <p>Processing</p>;

    case "retrieved":
      return <p>Complete</p>;

    case "aborted":
      return <p>Aborted</p>;

    case "rejected":
      return <p>Rejected</p>;
  }
}
