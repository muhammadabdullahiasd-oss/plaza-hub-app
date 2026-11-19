"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { identityPost, inputClass } from "./request";

export function SignInForm({ available }: { available: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [factor, setFactor] = useState<"password" | "totp" | "backup">("password");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true); setError("");
    try {
      const response = await identityPost(factor === "password" ? "/api/auth/sign-in/email" : `/api/auth/two-factor/verify-${factor === "totp" ? "totp" : "backup-code"}`, factor === "password" ? { email: data.get("email"), password: data.get("password") } : { code: data.get("code") });
      form.reset();
      if (response.twoFactorRedirect) { setFactor("totp"); } else { window.location.replace("/staff"); }
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to sign in."); }
    finally { setPending(false); }
  }
  return (
    <form onSubmit={submit} className="space-y-5" aria-describedby="signin-help">
      <p id="signin-help" className="text-sm leading-6 text-muted-foreground">Use the staff account supplied by your organization. Public registration is unavailable.</p>
      {!available && <p role="status" className="rounded-lg border p-4 text-sm">Staff sign-in is not configured for this environment.</p>}
      {factor === "password" ? <>
        <label className="block font-medium" htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="username" required maxLength={254} className={inputClass} /></label>
        <label className="block font-medium" htmlFor="password">Password<input id="password" name="password" type="password" autoComplete="current-password" required maxLength={128} className={inputClass} /></label>
      </> : <>
        <label className="block font-medium" htmlFor="code">{factor === "totp" ? "Authenticator code" : "Backup code"}<input key={factor} id="code" name="code" autoComplete="one-time-code" inputMode={factor === "totp" ? "numeric" : "text"} required maxLength={64} className={inputClass} /></label>
        <button type="button" className="min-h-11 underline" onClick={() => { setFactor(factor === "totp" ? "backup" : "totp"); setError(""); }}>{factor === "totp" ? "Use a backup code" : "Use an authenticator code"}</button>
      </>}
      <p role="alert" className="text-sm">{error}</p>
      <Button type="submit" disabled={!available || pending} className="w-full">{pending ? "Signing in…" : factor === "password" ? "Sign in" : "Verify and sign in"}</Button>
      <p className="text-sm leading-6 text-muted-foreground">Password recovery and email verification are not available yet. Contact your organization owner if you need help.</p>
    </form>
  );
}
