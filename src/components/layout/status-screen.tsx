import { Logo } from "./logo";

export function StatusScreen({
  code,
  title,
  description,
  icon,
  children,
}: {
  code?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <Logo />
      <div className="mt-10 w-full max-w-[460px] text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-[18px] bg-[#23272e] text-[#a0a7b0]">{icon}</span>
        {code && <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#80878f]">{code}</p>}
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.02em]">{title}</h1>
        <p className="mt-2 text-[14.5px] text-muted">{description}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">{children}</div>
      </div>
    </main>
  );
}