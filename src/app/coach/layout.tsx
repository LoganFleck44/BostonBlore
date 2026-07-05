import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CoachNav } from "@/components/coach/CoachNav";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "trainer") redirect("/login");

  return (
    <div className="flex min-h-screen bg-ink">
      <CoachNav user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-5 py-8 max-lg:pt-20 max-lg:pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
