import Client from "fhirclient/lib/Client";

export default async function ehiExport(
  client: Client | null,
  signal: AbortSignal
) {
  const { response } = await client?.request({
    url: `/Patient/${client.getPatientId()}/$ehi-export`,
    method: "POST",
    includeResponse: true,
    signal,
  });
  const link = response.headers.get("Link");
  if (link) {
    // If there is a patient-interaction link, get it so we can redirect the user there
    const [href, rel] = link.split(/\s*;\s*/);
    if (href && rel === 'rel="patient-interaction"') {
      return href;
    }
  }
}
