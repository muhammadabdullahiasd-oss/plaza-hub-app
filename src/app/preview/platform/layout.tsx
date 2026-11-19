import type { ReactNode } from "react";
import { ExperienceShell } from "@/components/layout/experience-shell";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return <ExperienceShell name="Platform">{children}</ExperienceShell>;
}
