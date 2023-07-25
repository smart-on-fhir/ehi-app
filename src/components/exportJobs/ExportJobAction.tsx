import LinkButton from "../generic/LinkButton";
import {
  getExportJobLink,
  abortExportJob,
  deleteExportJob,
} from "../../api/patientApiHandlers";
import Button from "../generic/Button";
import { getCustomizeUrl } from "../../lib/jobHelpers";
import { useNotificationContext } from "../../context/notificationContext";

type ExportJobActionProps = {
  job: EHIApp.PatientExportJob;
  refreshJobs: (signal?: AbortSignal | undefined) => Promise<void>;
};

function DeleteButton({ job, refreshJobs }: ExportJobActionProps) {
  const { createNotification } = useNotificationContext();
  const { id } = job;
  return (
    <Button
      variant="danger"
      onClick={async () => {
        await deleteExportJob(id)
          .then(() => {
            createNotification({
              title: `Successfully deleted job '${id}'.`,
              variant: "success",
            });
          })
          .catch((err: Error) =>
            createNotification({
              title: `Error deleting job '${id}'.`,
              errorMessage: err.message,
              variant: "error",
            })
          );
        refreshJobs();
      }}
    >
      Delete Now
    </Button>
  );
}

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
          <DeleteButton job={job} refreshJobs={refreshJobs} />
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
          <DeleteButton job={job} refreshJobs={refreshJobs} />
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
    case "aborted":
      return <DeleteButton job={job} refreshJobs={refreshJobs} />;
  }
}
