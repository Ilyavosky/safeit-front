export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pb-8 pt-16 sm:justify-center sm:pt-8">
      <main className="flex w-full justify-center">{children}</main>
    </div>
  );
}