import { requireIdentity } from "@/modules/identity/pages";
import { platformAccess } from "@/modules/identity/service";
export default async function PlatformPage() {
  const identity = await requireIdentity();
  if (!await platformAccess(identity)) return null;
  return <><h1 className="text-3xl font-bold">Platform administration</h1><p>Your platform role is active. Customer records are not available through platform administration.</p><p>Organization provisioning is not enabled. No production administration actions are available.</p></>;
}
