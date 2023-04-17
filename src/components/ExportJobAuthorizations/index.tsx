import { ExportJob } from "../../types";
import CodeBlock from "../CodeBlock";

export default function ExportJobAuthorizations({
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
