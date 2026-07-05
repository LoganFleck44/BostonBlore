import { db } from "@/lib/db";
import Link from "next/link";
import { ClientPaymentToggle } from "@/components/coach/ClientPaymentToggle";

function daysSince(date: Date | null) {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

export default async function ClientsPage() {
  const clients = await db.user.findMany({
    where: { role: "client" },
    include: {
      profile: true,
      workoutPlans: { where: { isActive: true }, select: { name: true } },
      mealPlans: { where: { isActive: true }, select: { name: true } },
      checkIns: { orderBy: { date: "desc" }, take: 1 },
    },
    orderBy: [{ hasPaid: "asc" }, { createdAt: "desc" }],
  });

  const pendingClients = clients.filter((client) => client.engagementStatus === "pending");
  const activeClients = clients.filter((client) => client.engagementStatus === "active");
  const inactiveClients = clients.filter((client) => client.engagementStatus === "inactive");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 font-display text-3xl font-bold uppercase">Clients</h1>
        <p className="text-ash">
          Pending applications stay separate until Boston manually confirms payment.
        </p>
      </div>

      <ClientSection
        title="Pending Payment"
        empty="No pending applications."
        clients={pendingClients}
      />
      <ClientSection
        title="Active Clients"
        empty="No active clients yet."
        clients={activeClients}
      />
      <ClientSection
        title="Inactive Clients"
        empty="No inactive clients."
        clients={inactiveClients}
      />
    </div>
  );
}

function ClientSection({
  title,
  empty,
  clients,
}: {
  title: string;
  empty: string;
  clients: Array<{
    id: string;
    name: string;
    email: string;
    hasPaid: boolean;
    engagementStatus: string;
    planInterest: string | null;
    profile: {
      goal: string | null;
    } | null;
    workoutPlans: Array<{ name: string }>;
    mealPlans: Array<{ name: string }>;
    checkIns: Array<{ date: Date; trainerReply: string | null }>;
  }>;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold uppercase">{title}</h2>
        <span className="rounded-full border border-ink-600 px-3 py-1 text-xs uppercase tracking-widest text-ash">
          {clients.length}
        </span>
      </div>
      {/* Mobile: stacked cards */}
      <div className="space-y-3 lg:hidden">
        {clients.length === 0 && (
          <p className="rounded-2xl border border-ink-600 bg-ink-700 px-4 py-8 text-center text-ash">
            {empty}
          </p>
        )}
        {clients.map((client) => {
          const lastCheckIn = client.checkIns[0] ?? null;
          const lastCheckInDays = daysSince(lastCheckIn?.date ?? null);
          return (
            <div key={client.id} className="rounded-2xl border border-ink-600 bg-ink-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/coach/clients/${client.id}`} className="font-medium hover:text-ember">
                    {client.name}
                  </Link>
                  <p className="truncate text-xs text-ash">{client.email}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-ash">
                    {client.engagementStatus}
                  </p>
                </div>
                <span className="shrink-0 text-right text-xs text-ash">
                  {lastCheckInDays === null ? "Never" : `${lastCheckInDays}d ago`}
                  {lastCheckIn && !lastCheckIn.trainerReply && (
                    <span className="ml-1 block text-ember">Reply</span>
                  )}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-ash">Plan</dt>
                  <dd>{client.planInterest ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-ash">Goal</dt>
                  <dd>{client.profile?.goal ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-ash">Training Plan</dt>
                  <dd>
                    {client.workoutPlans[0]?.name ?? (
                      <Link href={`/coach/clients/${client.id}/plan`} className="text-ember text-xs hover:underline">
                        + Assign
                      </Link>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-ash">Meal Plan</dt>
                  <dd>
                    {client.mealPlans[0]?.name ?? (
                      <Link href={`/coach/clients/${client.id}/meal`} className="text-ember text-xs hover:underline">
                        + Assign
                      </Link>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-ink-600 pt-3">
                <ClientPaymentToggle
                  clientId={client.id}
                  clientName={client.name}
                  hasPaid={client.hasPaid}
                  engagementStatus={client.engagementStatus as "pending" | "active" | "inactive"}
                  compact
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-ink-600 lg:block">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-600 bg-ink-800">
            <tr>
              {["Client", "Plan", "Goal", "Training Plan", "Meal Plan", "Last Check-In", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-ash"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-600 bg-ink-700">
            {clients.map((client) => {
              const lastCheckIn = client.checkIns[0] ?? null;
              const lastCheckInDays = daysSince(lastCheckIn?.date ?? null);

              return (
                <tr key={client.id} className="hover:bg-ink-600 transition">
                  <td className="px-4 py-3">
                    <Link href={`/coach/clients/${client.id}`} className="font-medium hover:text-ember">
                      {client.name}
                    </Link>
                    <p className="text-xs text-ash">{client.email}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-ash">
                      {client.engagementStatus}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-ash">{client.planInterest ?? "-"}</td>
                  <td className="px-4 py-3 text-ash">{client.profile?.goal ?? "-"}</td>
                  <td className="px-4 py-3">
                    {client.workoutPlans[0]?.name ?? (
                      <Link
                        href={`/coach/clients/${client.id}/plan`}
                        className="text-ember text-xs hover:underline"
                      >
                        + Assign
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {client.mealPlans[0]?.name ?? (
                      <Link
                        href={`/coach/clients/${client.id}/meal`}
                        className="text-ember text-xs hover:underline"
                      >
                        + Assign
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ash">
                    {lastCheckInDays === null ? "Never" : `${lastCheckInDays}d ago`}
                    {lastCheckIn && !lastCheckIn.trainerReply && (
                      <span className="ml-2 text-ember text-xs">Reply</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ClientPaymentToggle
                      clientId={client.id}
                      clientName={client.name}
                      hasPaid={client.hasPaid}
                      engagementStatus={client.engagementStatus as "pending" | "active" | "inactive"}
                      compact
                    />
                  </td>
                </tr>
              );
            })}
            {clients.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ash">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
