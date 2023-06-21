function formatAuthorizations(
  authorizations: EHIApp.ExportJobAuthorizations | undefined
) {
  const emptyMessage =
    "Authorizations have not been provided for any protected or privileged health information";
  if (
    authorizations === undefined ||
    Object.keys(authorizations).length === 0
  ) {
    return emptyMessage;
  }
  const activeParameters = Object.entries(authorizations)
    .map(([paramKey, paramValue]: [string, EHIApp.ExportJobAuthorization]) => {
      if (paramValue.value) {
        return paramKey;
      } else {
        return undefined;
      }
    })
    .filter((x) => !!x)
    .join(", ");
  if (activeParameters.length === 0) {
    return emptyMessage;
  }
  return (
    "Authorizations provided for the following privileged data: " +
    activeParameters +
    "."
  );
}

function formatParameters(
  parameters: EHIApp.ExportJobInformationParameters | undefined
) {
  const emptyMessage = "No attachments requested";

  if (parameters === undefined) {
    return emptyMessage;
  }
  const activeParameters = Object.entries(parameters)
    .map(
      ([paramKey, paramValue]: [
        string,
        EHIApp.ExportJobInformationParameter
      ]) => {
        if (paramValue.enabled) {
          return paramKey;
        } else {
          return undefined;
        }
      }
    )
    .filter((x) => !!x)
    .join(", ");
  if (activeParameters.length === 0) {
    return emptyMessage;
  }
  return "Attachments requested for: " + activeParameters + ".";
}

export default function ExportJobParametersAuthorizations({
  job,
}: {
  job: EHIApp.ExportJob;
}) {
  const authorizations = job.authorizations;
  const parameters = job.parameters;
  return (
    <section className="text-sm">
      <p>{formatParameters(parameters)}</p>
      <p>{formatAuthorizations(authorizations)}</p>
    </section>
  );
}
