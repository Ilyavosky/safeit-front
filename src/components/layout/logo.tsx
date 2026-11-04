import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <p className={cn("text-[20px] font-bold tracking-[-0.02em] text-text", className)}>
      Safe<span className="text-accent">IT</span>
    </p>
  );
}