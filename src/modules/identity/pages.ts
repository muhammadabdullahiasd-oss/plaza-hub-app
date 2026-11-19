import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentSession } from "./service";

export async function requireIdentity() {
  const requestHeaders = await headers();
  const identity = await currentSession(requestHeaders).catch(() => null);
  if (!identity) redirect("/sign-in");
  return identity;
}
