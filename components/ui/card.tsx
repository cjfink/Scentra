import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/90 bg-card/95 p-5 shadow-[0_8px_30px_rgba(24,35,50,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
