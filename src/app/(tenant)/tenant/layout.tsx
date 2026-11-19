import type { ReactNode } from "react";
import { ExperienceShell } from "@/components/layout/experience-shell";

export default function TenantLayout({ children }: { children: ReactNode }) {
  return <ExperienceShell name="Tenant" compact>{children}</ExperienceShell>;
}
