import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-[100px] w-full rounded-md border border-input bg-background p-3 text-sm", props.className)} {...props} />;
}
