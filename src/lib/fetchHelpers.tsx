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

  let type = res.headers.get("Content-Type") + "";
  let body = await res.text();

  if (!res.ok) {
    throw new Error(res.status + ": " + (body || res.statusText));
  }

  if (body.length && type.match(/\bjson\b/i)) {
    body = JSON.parse(body);
  }

  return body as T;
}
