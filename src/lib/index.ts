import { Location as ReactRouterLocation } from "react-router";
import { UnauthorizedError } from "./errors";

/**
 * A helper function that takes either a native Location object
 * or a react-router Location and determines if its on an admin page
 * @param location A Location object
 * @returns true if we are a
 */
export function isAdminRoute(location: Location | ReactRouterLocation) {
  return location.pathname.indexOf("/admin") !== -1;
}

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
    // Handle 401 errors by throwing an UnauthorizedError
    if (res.status === 401) {
      throw new UnauthorizedError("Unauthorized 401");
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
