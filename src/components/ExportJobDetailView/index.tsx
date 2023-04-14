import { ExportJob } from "../../types";
import CodeBlock from "../CodeBlock";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import LinkButton from "../LinkButton";

type ExportJobDetailViewProps = {
  job: ExportJob;
};

function ParametersView({
  parameters,
}: {
  parameters: ExportJob["parameters"];
}) {
  return (
    <>
      {"ParametersView"}

      <CodeBlock>{JSON.stringify(parameters, null, 2)}</CodeBlock>
    </>
  );
}
function AuthorizationsView({
  authorizations,
}: {
  authorizations: ExportJob["authorizations"];
}) {
  return (
    <>
      {"AuthorizationsView"}
      <CodeBlock>{JSON.stringify(authorizations, null, 2)}</CodeBlock>
    </>
  );
}

export default function ExportJobDetailView({ job }: ExportJobDetailViewProps) {
  return (
    <article className="max-h-[80vh] overflow-y-scroll rounded border p-4">
      <header className="flex">
        <div className="flex flex-col items-center text-center">
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
          <LinkButton className="w-24" to={`/admin/jobs/${job.id}`}>
            Details
          </LinkButton>
        </div>
      </header>
      <main>
        <ParametersView parameters={job?.parameters} />
        <AuthorizationsView authorizations={job?.authorizations} />
      </main>
    </article>
  );
}
