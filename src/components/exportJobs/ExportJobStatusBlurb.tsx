import { ExportJobStatus } from "../../types";

type ExportJobBlurbProps = {
  status: ExportJobStatus;
};

export default function ExportJobBlurb({ status }: ExportJobBlurbProps) {
  switch (status) {
    case "awaiting-input":
      return <p>Information Needed</p>;

    case "in-review":
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
