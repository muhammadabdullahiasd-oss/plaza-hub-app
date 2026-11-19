const LOCAL_DATABASE_URL =
  "postgresql://plazahub:plazahub_local_only@127.0.0.1:5432/plazahub_dev";

/** Foundation-only guard. Remote connections require a later reviewed change. */
export function localDatabaseUrl(value = LOCAL_DATABASE_URL): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("DATABASE_URL must be a valid local PostgreSQL URL.");
  }
  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    url.search !== "" ||
    url.hash !== ""
  ) {
    // Query-string connection overrides can bypass an otherwise local host.
    throw new Error("Task 004 permits only loopback PostgreSQL URLs without overrides.");
  }
  return url.toString();
}
