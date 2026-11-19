"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { identityPost, inputClass } from "./request";

/** Local rehearsal only. Secrets stay in component memory and are never persisted by the UI. */
export function MfaEnrollment({ enabled }: { enabled: boolean }) {
  const [enrollment, setEnrollment] = useState<{ uri: string; codes: string[] } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true); setError("");
    try {
      if (enrollment) {
        await identityPost("/api/auth/two-factor/verify-totp", { code: data.get("code") });
        setEnrollment(null); window.location.replace("/staff");
      } else {
        const result = await identityPost("/api/auth/two-factor/enable", { password: data.get("password") });
        if (typeof result.totpURI !== "string" || !Array.isArray(result.backupCodes) || !result.backupCodes.every((code: unknown) => typeof code === "string")) throw new Error("Enrollment could not be started.");
        setEnrollment({ uri: result.totpURI, codes: result.backupCodes });
      }
      form.reset();
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to enroll."); }
    finally { setPending(false); }
  }
  if (enabled) return <p>Authenticator enrolled. Keep your backup codes in a safe place. Account recovery is not available yet.</p>;
  return <form onSubmit={submit} className="max-w-lg space-y-4"><p className="text-sm leading-6">Local development enrollment. Production MFA and recovery are awaiting verification.</p>{enrollment ? <><p>Import this URI into your authenticator. Treat it as a password.</p><code className="block break-all rounded border p-3 text-xs">{enrollment.uri}</code><p>Save these one-use backup codes before continuing:</p><ul className="grid grid-cols-1 gap-2 font-mono text-sm sm:grid-cols-2">{enrollment.codes.map((code) => <li key={code}>{code}</li>)}</ul><label className="block" htmlFor="mfa-code">Authenticator code<input id="mfa-code" name="code" inputMode="numeric" autoComplete="one-time-code" required className={inputClass} /></label></> : <label className="block" htmlFor="mfa-password">Confirm your password<input id="mfa-password" name="password" type="password" autoComplete="current-password" required className={inputClass} /></label>}<Button disabled={pending} type="submit">{pending ? "Please wait…" : enrollment ? "Verify authenticator" : "Set up authenticator"}</Button><p role="alert">{error}</p></form>;
}
