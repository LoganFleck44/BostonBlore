import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-ink">
      <DashboardNav user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-5 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
