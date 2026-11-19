/** Decorative building illustration, intentionally not an operational dashboard. */
export function PlazaIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl bg-secondary p-6 sm:p-9">
      <svg viewBox="0 0 360 300" className="h-auto w-full" aria-hidden="true">
        <circle cx="274" cy="62" r="35" fill="#c1e4dc" />
        <path d="M30 260H330" stroke="#8db6ac" strokeWidth="2" />
        <path d="M64 260V83L180 42l116 41v177" fill="#fff" stroke="#142c40" strokeWidth="5" strokeLinejoin="round" />
        <path d="M64 144h232M64 200h232" stroke="#142c40" strokeWidth="5" />
        <path d="M86 107h39v22H86zM160 107h39v22h-39zM234 107h39v22h-39z" fill="#a5d6ca" />
        <path d="M86 160h39v24H86zM160 160h39v24h-39zM234 160h39v24h-39z" fill="#a5d6ca" />
        <path d="M83 260v-44h50v44m22 0v-44h50v44m22 0v-44h50v44" fill="#e8f3f0" stroke="#142c40" strokeWidth="4" />
        <path d="M72 199h216v12H72z" fill="#14776b" />
        <path d="M37 260v-38m0 10c-20-1-22-25-14-31 14 1 17 20 14 31m0 2c21-1 26-23 17-31-13 3-18 18-17 31" fill="#4c9d88" />
        <path d="M321 260v-35m0 6c-17-1-22-21-14-29 13 2 17 17 14 29" fill="#4c9d88" />
      </svg>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-card p-4">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <p className="text-sm font-medium">A thoughtful foundation for everyday plaza management.</p>
      </div>
    </div>
  );
}
