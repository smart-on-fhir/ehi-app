import { EHISERVERFHIRURL, EHISERVERBASEURL } from "../../lib/constants";
import { findMatchingInstitution } from "../../lib/institutionHelpers";
import { ExportJob } from "../../types";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";

type ExportJobListItemSmallProps = {
  job: ExportJob;
};

export default function ExportJobListItemSmall({
  job,
}: ExportJobListItemSmallProps) {
  // UI component needs five things:
  // 1. URL for the FHIR server
  // NOTE: In a world where the export-jobs from multiple institutions are being listed in the same place,
  //       this would be odd. Should be fine for demo purposes.
  const url = EHISERVERFHIRURL;
  // 2. Institution name
  const institutionName = findMatchingInstitution(url)?.displayName;
  // 3. Status indicator
  const status = job.status;
  // 4. Date to display
  // NOTE: Should this field change depending on status? Mockups suggest multiple dates on the ExportJob
  const createdDate = new Date(job.createdAt);
  // 5. If awaiting-input, link to form
  const link =
    status === "awaiting-input"
      ? `${EHISERVERBASEURL}/jobs/${job.id}/customize`
      : null;
  //
  function Blurb() {
    if (status === "awaiting-input") {
      return link ? (
        <a href={link} className="italic text-blue-600 underline">
          Complete Request
        </a>
      ) : null;
    } else {
      return <p>{`Created ${createdDate}`}</p>;
    }
  }

  return (
    <li>
      <p className="font-bold">{institutionName}</p>
      <div className="flex items-center">
        <ExportJobStatusIndicator status={status} size={16} />
        <Blurb />
      </div>
    </li>
  );
}
