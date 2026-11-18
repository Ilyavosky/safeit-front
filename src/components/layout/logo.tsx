import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-[34px] place-items-center rounded-[10px] bg-accent text-accent-fg">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l7.5 3v5.5c0 4.4-3.1 8-7.5 9.5-4.4-1.5-7.5-5.1-7.5-9.5V6L12 3z" />
          <path d="M8.8 12.2l2.2 2.2 4.3-4.6" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-[-0.02em] text-text">
        Safe<span className="text-accent">IT</span>
      </span>
    </div>
  );
}