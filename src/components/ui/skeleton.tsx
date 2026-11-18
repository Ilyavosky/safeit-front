import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block h-2.5 rounded-full bg-line", className)} aria-hidden="true" />;
}