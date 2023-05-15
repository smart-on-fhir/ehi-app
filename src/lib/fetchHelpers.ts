import { operationOutcomeSummary } from "./fhirHelpers";

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const fullPath = path.replace(
    /^\//,
    (process!.env!.REACT_APP_EHI_SERVER || "") + "/"
  );
  const res = await fetch(fullPath, {
    mode: "cors",
    ...options,
  });

  const type = res.headers.get("Content-Type") + "";
  let body = await res.text();

  // Handle errors accordingly
  if (!res.ok) {
    // FHIR Servers responding with a 404 will return operationOutcome info
    if (res.status === 404 && type.match(/\bjson\b/i)) {
      const operationOutcome = JSON.parse(body);
      // If we have operationOutcome information, use it
      if (
        operationOutcome?.issue[0]?.severity &&
        operationOutcome?.issue[0]?.diagnostics
      ) {
        throw new Error(
          `${res.status}: ${operationOutcomeSummary(operationOutcome)}"`
        );
      }
    }
    // else, provide default message
    throw new Error(res.status + ": " + (body || res.statusText));
  }

  // Successful response, parse potential JSON accordingly
  if (body.length && type.match(/\bjson\b/i)) {
    body = JSON.parse(body);
  }

  return body as T;
}
