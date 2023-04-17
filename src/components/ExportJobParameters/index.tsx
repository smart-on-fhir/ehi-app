import { ExportJob } from "../../types";
import CodeBlock from "../CodeBlock";

export default function ExportJobParameters({
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
