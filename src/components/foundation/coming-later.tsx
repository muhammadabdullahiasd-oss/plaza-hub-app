export function ComingLater({ items }: { items: readonly string[] }) {
  return (
    <ul className="divide-y rounded-xl border bg-card" aria-label="Features coming later">
      {items.map((item) => (
        <li key={item} className="flex flex-wrap items-center justify-between gap-2 p-5">
          <span className="font-medium">{item}</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Not available yet</span>
        </li>
      ))}
    </ul>
  );
}
