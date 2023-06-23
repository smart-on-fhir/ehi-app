import { formatDate } from "../../lib";

/**
 * Formats authorization information into a newline-formatted string
 * @param authorizations
 * @returns
 */
function formatAuthorizations(
  authorizations: EHIApp.ExportJobAuthorizations | undefined
) {
  const emptyMessage =
    "Authorizations have not been provided for any protected or privileged health information.";
  if (
    authorizations === undefined ||
    Object.keys(authorizations).length === 0
  ) {
    return emptyMessage;
  }
  const activeAuthorizations = Object.values(authorizations)
    .map((authorization: EHIApp.ExportJobAuthorization) => {
      if (authorization.value) {
        return (
          authorization.name +
          // Optionally include authorization information represented as free-text
          (authorization.value !== true ? ` [${authorization.value}]` : "")
        );
      } else {
        return undefined;
      }
    })
    .filter(Boolean)
    .join(", ");
  if (activeAuthorizations.length === 0) {
    return emptyMessage;
  }
  return (
    "Authorizations were provided for the following privileged data: " +
    activeAuthorizations +
    "."
  );
}

/**
 * Formats parameter information into a newline-formatted string
 * @param parameters
 * @returns
 */
function formatParameters(
  parameters: EHIApp.ExportJobInformationParameters | undefined
) {
  const emptyMessage = "No specific attachments requested.";

  if (parameters === undefined) {
    return emptyMessage;
  }
  const activeParameters = Object.values(parameters)
    .map((param: EHIApp.ExportJobInformationParameter) => {
      if (param.enabled) {
        return (
          param.name +
          // Provide from-date information if possible
          (param.from ? ` from ${formatDate(param.from)}` : "") +
          // Provide to-date information if possible
          (param.to ? ` until ${formatDate(param.to)}` : "") +
          // Include notes as an aside if if possible
          (param.notes !== "" ? ` [${param.notes}]` : "")
        );
      } else {
        return undefined;
      }
    })
    .filter(Boolean)
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
