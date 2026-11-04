import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

type AuthCardProps = { title: string; description?: string; children: React.ReactNode };

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-[440px] px-7 pb-8 pt-9 sm:px-9">
      <Logo className="text-center" />
      <h1 className="mt-4 text-center text-[23px] font-semibold tracking-[-0.015em]">{title}</h1>
      {description && <p className="mt-1.5 text-center text-sm text-muted">{description}</p>}
      <div className="mt-7">{children}</div>
    </Card>
  );
}