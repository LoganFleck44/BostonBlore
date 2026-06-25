import { db } from "@/lib/db";
import Link from "next/link";
import { CheckInReplyForm } from "@/components/coach/CheckInReplyForm";

export default async function CoachCheckInsPage() {
  const pending = await db.checkIn.findMany({
    where: { trainerReply: null },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  });

  const recent = await db.checkIn.findMany({
    where: { NOT: { trainerReply: null } },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
    take: 10,
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold uppercase">Check-Ins</h1>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-semibold uppercase text-ember">Needs Reply ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((ci) => (
              <div key={ci.id} className="rounded-2xl border border-ember/40 bg-ember/5 p-5">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/coach/clients/${ci.user.id}`} className="font-semibold hover:text-ember">{ci.user.name}</Link>
                  <p className="text-xs text-ash">{new Date(ci.date).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}</p>
                </div>
                <div className="flex gap-4 text-xs text-ash mb-2">
                  <span>Energy: {ci.energyLevel}/10</span>
                  <span>Training: {ci.trainingAdhere}/10</span>
                  <span>Nutrition: {ci.nutritionAdhere}/10</span>
                </div>
                {ci.wins && <p className="text-sm mb-1"><span className="text-green-400">Win:</span> {ci.wins}</p>}
                {ci.struggles && <p className="text-sm mb-1"><span className="text-ember">Struggle:</span> {ci.struggles}</p>}
                {ci.questions && <p className="text-sm mb-2"><span className="text-gold">Question:</span> {ci.questions}</p>}
                <CheckInReplyForm checkInId={ci.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold uppercase">Recent Replied</h2>
        <div className="space-y-3">
          {recent.map((ci) => (
            <div key={ci.id} className="rounded-xl border border-ink-600 bg-ink-700 px-5 py-3 flex items-center justify-between">
              <div>
                <Link href={`/coach/clients/${ci.user.id}`} className="font-medium hover:text-ember">{ci.user.name}</Link>
                <p className="text-xs text-ash">{new Date(ci.date).toLocaleDateString()}</p>
              </div>
              <span className="text-xs text-green-400">✓ Replied</span>
            </div>
          ))}
          {pending.length === 0 && recent.length === 0 && <p className="text-ash">No check-ins yet.</p>}
        </div>
      </div>
    </div>
  );
}
