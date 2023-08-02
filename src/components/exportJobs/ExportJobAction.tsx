import LinkButton from "../generic/LinkButton";
import { getExportJobLink, abortExportJob } from "../../api/patientApiHandlers";
import Button from "../generic/Button";
import { getCustomizeUrl } from "../../lib/jobHelpers";
import { useNotificationContext } from "../../context/notificationContext";
import DeleteExportJobButton from "./DeleteExportJobButton";

type ExportJobActionProps = {
  job: EHIApp.PatientExportJob;
  refreshJobs: (requestOptions?: RequestInit) => Promise<void>;
};

export default function ExportJobAction({
  job,
  refreshJobs,
}: ExportJobActionProps) {
  const { createNotification } = useNotificationContext();
  const { status, id } = job;
  switch (status) {
    case "awaiting-input":
      return (
        <>
          <DeleteExportJobButton job={job} refreshJobs={refreshJobs} />
          <LinkButton className="min-w-fit" to={getCustomizeUrl(job)}>
            Complete Form
          </LinkButton>
        </>
      );

    case "requested":
      return (
        <Button
          onClick={async () => {
            await abortExportJob(id).then(() => {
              createNotification({
                title: `Successfully aborted job'${id}'.`,
                variant: "success",
              });
            });
            refreshJobs();
          }}
        >
          Abort
        </Button>
      );

    case "approved":
      return (
        <>
          <DeleteExportJobButton job={job} refreshJobs={refreshJobs} />
          <LinkButton
            className="min-w-fit"
            download
            target="_blank"
            to={getExportJobLink(id)}
          >
            Download
          </LinkButton>
        </>
      );

    case "deleted":
      return (
        <DeleteExportJobButton
          job={job}
          refreshJobs={refreshJobs}
          ignoreError={true}
        />
      );
  }
}
