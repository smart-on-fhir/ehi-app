import { formatDate } from "../../lib";
import ExportJobNoFormDataDisclaimer from "./ExportJobNoFormDataDisclaimer";

/**
 * Formats authorization information to identify info that IS authorized for release
 * @param authorizations
 * @returns
 */
function formatAuthorizedReleases(
  authorizations: EHIApp.ExportJobAuthorizations | undefined
) {
  if (
    authorizations === undefined ||
    Object.keys(authorizations).length === 0
  ) {
    return null;
  }
  const activeAuthorizations = Object.values(authorizations)
    .map((authorization: EHIApp.ExportJobAuthorization) => {
      if (authorization.value) {
        return (
          authorization.name +
          // Optionally include authorization information represented as free-text
          (authorization.value !== true ? ` [${authorization.value}]` : "")
        );
      } else return undefined;
    })
    .filter(Boolean)
    .join(", ");
  const activeAuthorizationsText = `Authorizations were provided to release the following: ${activeAuthorizations}.`;

  if (activeAuthorizations.length === 0) return null;
  return <p>{activeAuthorizationsText}</p>;
}

/**
 * Formats authorization information to identify info NOT authorized for release
 * @param authorizations
 * @returns
 */
function formatUnauthorizedReleases(
  authorizations: EHIApp.ExportJobAuthorizations | undefined
) {
  const emptyMessage = "No specific data was authorized for release.";

  if (
    authorizations === undefined ||
    Object.keys(authorizations).length === 0
  ) {
    return <p>{emptyMessage}</p>;
  }
  const disabledAuthorizations = Object.values(authorizations)
    .map((authorization: EHIApp.ExportJobAuthorization) => {
      // Special case: ignore Others for disabled fields
      if (authorization.name === "Other(s)") return undefined;
      if (!authorization.value) {
        return authorization.name;
      } else return undefined;
    })
    .filter(Boolean)
    .join(", ");
  const disabledAuthorizationsText = `Authorizations were NOT provided to release the following: ${disabledAuthorizations}.`;

  return <p>{disabledAuthorizationsText}</p>;
}

/**
 * Translates job parameters into human-readable descriptions regarding specific record requests
 * @param parameters
 * @returns a paragraph explaining what kind of records the user did or did not request
 */
function formatParameters(
  parameters: EHIApp.ExportJobInformationParameters | undefined
) {
  const emptyMessage = "No specific records or documents were requested.";

  if (parameters === undefined) {
    return <p>{emptyMessage}</p>;
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

  // Confirm there are parameters even after boolean filter
  if (activeParameters.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <p>
      Before approving, consider additional attachments for: {activeParameters}.
    </p>
  );
}

export default function ExportJobParametersAuthorizations({
  job,
}: {
  job: EHIApp.ExportJob;
}) {
  // Render a placeholder if the form hasn't been completed yet
  if (job.status === "awaiting-input") return <ExportJobNoFormDataDisclaimer />;
  const { authorizations, parameters } = job;
  return (
    <section className="space-y-1 text-sm">
      {formatAuthorizedReleases(authorizations)}
      {formatUnauthorizedReleases(authorizations)}
      {formatParameters(parameters)}
    </section>
  );
}
