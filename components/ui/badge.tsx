export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-muted px-3 py-1 text-xs">{children}</span>;
}
