export async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export function operationOutcomeSummary(
  operationOutcome: fhir4.OperationOutcome
) {
  return `Returned operation outcome of "${operationOutcome.issue[0].severity} : ${operationOutcome.issue[0].diagnostics}`;
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
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

// Unified formatter for date-time stings
export function formatDateTime(date: number) {
  return new Date(date).toLocaleString();
}

export function formatDate(date: number | string) {
  return new Date(date).toDateString();
}
