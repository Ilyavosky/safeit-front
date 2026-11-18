import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

type AuthCardProps = {
  title: string;
  description?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
};

export function AuthCard({ title, description, header, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-[440px] rounded-[18px] border-[#2a2e35] px-7 pb-8 pt-8 sm:px-9">
      <Logo className="justify-center" />
      {header && <div className="mt-[18px]">{header}</div>}
      <h1 className="mt-[18px] text-center text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
      {description && <p className="mt-1.5 text-center text-sm text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </Card>
  );
}