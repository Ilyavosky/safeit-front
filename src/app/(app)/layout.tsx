import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Topbar />
        <main className="flex flex-1 flex-col gap-5 px-5 py-7 sm:px-8">{children}</main>
      </div>
    </div>
  );
}