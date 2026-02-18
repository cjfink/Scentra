import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-lg border border-input bg-background p-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        props.className,
      )}
      {...props}
    />
  );
}
