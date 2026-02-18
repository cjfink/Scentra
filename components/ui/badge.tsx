export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}
