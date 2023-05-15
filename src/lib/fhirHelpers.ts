export function operationOutcomeSummary(
  operationOutcome: fhir4.OperationOutcome
) {
  return `Returned operation outcome of "${operationOutcome.issue[0].severity} : ${operationOutcome.issue[0].diagnostics}`;
}
