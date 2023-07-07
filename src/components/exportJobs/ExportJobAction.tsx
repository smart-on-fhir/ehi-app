import LinkButton from "../generic/LinkButton";
import {
  // getExportJobLink,
  abortExportJob,
  getDownloadables,
} from "../../lib/exportJobHelpers";
import DownloadableLink from "./DownloadableLink";
import Button from "../generic/Button";
import { useState } from "react";

type ExportJobActionProps = {
  job: EHIApp.ExportJob;
  status: EHIApp.ExportJobStatus;
  syncJobs: Function;
};

export default function ExportJobAction({
  job,
  status,
  syncJobs,
}: ExportJobActionProps) {
  const link = `${job.customizeUrl}&redirect=${
    window.location.origin + window.location.pathname
  }`;
  const downloads = getDownloadables(job);

  const [showDownload, setShowDownload] = useState(false);

  switch (status) {
    case "awaiting-input":
      return (
        <LinkButton className="min-w-fit" to={link}>
          Complete Form
        </LinkButton>
      );

    case "approved":
      return (
        <>
          <Button
            className="relative min-w-fit"
            onClick={() => {
              setShowDownload(!showDownload);
            }}
            onBlur={() => {
              // setShowDownload(false);
            }}
          >
            Download
            {showDownload && (
              <div className="absolute right-0 top-full m-1 flex max-w-md flex-auto flex-wrap rounded border bg-primary-50">
                {downloads.map((d) => (
                  <div
                    className="basis-28 p-1 text-sm text-active underline"
                    key={d.url}
                  >
                    <DownloadableLink downloadable={d} />
                  </div>
                ))}
              </div>
            )}
          </Button>
        </>
      );

    case "in-review":
      return (
        <Button
          onClick={async () => {
            await abortExportJob(job.id);
            syncJobs();
          }}
        >
          Abort
        </Button>
      );
    case "requested":
    case "aborted":
    case "rejected":
      return null;
  }
}
