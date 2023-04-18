import { ExportJob } from "../../types";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobParameters from "../ExportJobParameters";
import ExportJobAuthorizations from "../ExportJobAuthorizations";
import Button from "../Button";
import { useState } from "react";

type ExportJobDetailViewProps = {
  job: ExportJob;
};

type Attachment = {
  name: string;
};

/**
 * Clips attachment names to be 24 chars long, including
 * file extension and ellipsis
 * @param name The attachment name to be clipped
 *
 */
function clipAttachmentName(name: Attachment["name"]) {
  const MAX_LENGTH = 24;
  if (name.length <= MAX_LENGTH) {
    return name;
  } else {
    // QUESTION: will there always be an extension? Not sure about the FileReader API
    const ext = "." + name.split(".").at(-1);
    const ellipsis = "[...]";
    const clippedName = name.slice(
      0,
      MAX_LENGTH - ext!.length - ellipsis.length
    );
    return clippedName + ellipsis + ext;
  }
}

function AttachmentChip({ attachment }: { attachment: Attachment }) {
  return (
    <p className="w-24 rounded border p-2 text-xs">
      {clipAttachmentName(attachment.name)}
    </p>
  );
}

export default function ExportJobDetailView({ job }: ExportJobDetailViewProps) {
  const [attachments, setAttachment] = useState<Attachment[]>([
    { name: "something" },
  ]);
  return (
    <article className="max-h-[80vh] px-2">
      <header className="flex items-center">
        <div className="flex w-24 flex-col items-center text-center">
          <ExportJobStatusIndicator status={job.status} />
          <p className="text-xs">{job.status.split("-").join(" ")}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Job #{job.id}</h1>
            <pre className="whitespace-pre-wrap text-xs italic opacity-50">
              {[
                `Patient ${job.patientId}`,
                `Created ${new Date(job.createdAt).toLocaleString()}`,
                `${job.attachments.length} Attachments`,
              ].join("\n")}
            </pre>
          </div>
        </div>
        <div className="flex w-24">
          <select className="h-fit p-2">
            <option value="">Review</option>
            <option value={"Approve"}>Approve</option>
            <option value={"Reject"}>Reject</option>
          </select>
        </div>
      </header>
      <section className="flex items-center justify-between">
        <div
          id="attachmentsContainer"
          className="flex w-full space-x-2 overflow-auto pb-2"
        >
          {attachments.map((attach) => {
            return <AttachmentChip key={attach.name} attachment={attach} />;
          })}
        </div>
        <Button
          className="mb-2"
          onClick={(e) => {
            setAttachment((prevAttachments) => [
              ...prevAttachments,
              { name: `attachment-${Math.random()}.txt` },
            ]);
          }}
        >
          Add Attachment +
        </Button>
      </section>
      <main className="max-h-[70vh] overflow-y-scroll">
        <ExportJobParameters parameters={job?.parameters} />
        <ExportJobAuthorizations authorizations={job?.authorizations} />
      </main>
    </article>
  );
}
