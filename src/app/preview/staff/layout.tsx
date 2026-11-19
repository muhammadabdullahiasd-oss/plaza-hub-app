import type { ReactNode } from "react";
import { ExperienceShell } from "@/components/layout/experience-shell";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <ExperienceShell name="Staff">{children}</ExperienceShell>;
}
