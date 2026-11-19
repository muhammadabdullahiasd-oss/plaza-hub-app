import type { Metadata } from "next";
import { SignInForm } from "@/components/identity/sign-in-form";
import { identityAvailable } from "@/modules/identity/config";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff sign-in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return <main id="main-content" tabIndex={-1} className="page-container py-12"><div className="mx-auto max-w-md space-y-6"><h1 className="text-3xl font-bold">Staff sign-in</h1><SignInForm available={identityAvailable()} /></div></main>;
}
