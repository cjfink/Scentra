import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-xl border border-input bg-background/90 p-3 text-sm shadow-[inset_0_1px_2px_rgba(24,35,50,0.06)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        props.className,
      )}
      {...props}
    />
  );
}
