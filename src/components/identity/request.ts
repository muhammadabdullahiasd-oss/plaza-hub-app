export async function identityPost(path: string, body: object): Promise<Record<string, unknown>> {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  const data: unknown = await response.json();
  const result = data && typeof data === "object" ? data as Record<string, unknown> : {};
  if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to complete this request.");
  return result;
}

export const inputClass = "mt-2 block min-h-11 w-full rounded-md border border-border bg-card px-3 py-2 text-base";
