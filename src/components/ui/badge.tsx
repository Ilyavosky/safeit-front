import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
};

export function Badge({ children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12.5px] font-semibold",
        className,
      )}
    >
      {dot && <span className="size-[7px] flex-none rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}