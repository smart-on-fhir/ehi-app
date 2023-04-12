import { EHISERVERFHIRURL } from "../../lib/constants";
import { ExportJob } from "../../types";

type ExportJobListItemSmallProps = {
  job: ExportJob;
};

export default function ExportJobListItemSmall({
  job,
}: ExportJobListItemSmallProps) {
  // Need the institution matched by this job
  return <li>{JSON.stringify(job)}</li>;
}
