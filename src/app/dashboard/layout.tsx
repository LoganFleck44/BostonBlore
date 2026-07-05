import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { requireActiveClientPage } from "@/lib/auth-guards";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireActiveClientPage();

  return (
    <div className="flex min-h-screen bg-ink">
      <DashboardNav user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-5 py-8 max-lg:pt-20 max-lg:pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
