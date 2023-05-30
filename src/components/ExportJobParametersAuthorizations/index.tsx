import {
  ExportJob,
  ExportJobInformationParameters,
  ExportJobInformationParameter,
  ExportJobAuthorization,
  ExportJobAuthorizations,
} from "../../types";

function isAuthorizationApproved(authorization: ExportJobAuthorization) {
  return Boolean(authorization.value);
}

function displayAuthorization(authorization: ExportJobAuthorization) {
  console.log(authorization);
  if (typeof authorization.value === "string") {
    return `${authorization.name} (${authorization.value})`;
  } else {
    return authorization.name;
  }
}

function formatPositiveAuthorizations(
  authorizations: ExportJobAuthorizations
): string {
  if (authorizations === undefined) {
    return "No authorizations found on this export request";
  }
  const positiveAuthorizations = Object.values(authorizations).filter(
    (authorization: ExportJobAuthorization) =>
      isAuthorizationApproved(authorization)
  );
  const emptyMessage =
    "Authorizations have not been provided for any protected or privileged health information";
  if (authorizations === undefined) {
    return emptyMessage;
  }
  return (
    "Authorizations provided for the following privileged data: " +
    positiveAuthorizations
      .map((authorization: ExportJobAuthorization) =>
        displayAuthorization(authorization)
      )
      .join(", ") +
    "."
  );
}

function formatUnauthorizedInformation(
  authorizations: ExportJobAuthorizations
) {
  const unauthorizedValues = Object.values(authorizations)
    .filter(
      (authorization: ExportJobAuthorization) =>
        !isAuthorizationApproved(authorization)
    )
    .map((authorization: ExportJobAuthorization) =>
      displayAuthorization(authorization)
    )
    .join(", ");
  return (
    "No authorizations for the following privileged data: " +
    unauthorizedValues +
    "."
  );
}

function formatAuthorizations(
  authorizations: ExportJobAuthorizations | undefined
) {
  if (authorizations === undefined) {
    return "No authorizations found on this export request";
  }

  return (
    formatPositiveAuthorizations(authorizations) +
    "\n" +
    formatUnauthorizedInformation(authorizations)
  );
}

function formatParameters(
  parameters: ExportJobInformationParameters | undefined
) {
  const emptyMessage = "No attachments requested";

  if (parameters === undefined) {
    return emptyMessage;
  }
  const activeParameters = Object.entries(parameters)
    .map(([paramKey, paramValue]: [string, ExportJobInformationParameter]) => {
      if (paramValue.enabled) {
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
  return "Attachments requested for: " + activeParameters + ".";
}

export default function ExportJobParametersAuthorizations({
  job,
}: {
  job: ExportJob;
}) {
  const authorizations = job.authorizations;
  const parameters = job.parameters;
  return (
    <section className="text-sm">
      <p>{formatParameters(parameters)}</p>
      <p className="whitespace-pre-wrap">
        {formatAuthorizations(authorizations)}
      </p>
    </section>
  );
}
