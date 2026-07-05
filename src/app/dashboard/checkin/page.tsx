import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckInForm } from "@/components/dashboard/CheckInForm";
import { PhotoThumb } from "@/components/dashboard/PhotoThumb";

const fmtDay = (d: Date) => new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

export default async function CheckInPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const history = await db.checkIn.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 5,
  });

  const photoHistory = await db.checkIn.findMany({
    where: { userId: session.user.id, NOT: { photoUrl: null } },
    orderBy: { date: "asc" },
    select: { id: true, date: true, photoUrl: true, weight: true },
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold uppercase">Weekly Check-In</h1>
      <p className="mb-8 text-ash">Keep Boston in the loop every week so he can adjust your plan and keep you moving forward.</p>

      <div className="rounded-2xl border border-ink-600 bg-ink-700 p-6">
        <CheckInForm />
      </div>

      {photoHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold uppercase">Progress Over Time</h2>
          <p className="mb-4 mt-1 text-sm text-ash">
            Oldest on the left, newest on the right. Weight shown in <span className="text-bone">lbs</span> — tap any photo to open it full size.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {photoHistory.map((p) => (
              <PhotoThumb
                key={p.id}
                src={p.photoUrl!}
                dateLabel={fmtDay(p.date)}
                weight={p.weight}
                imgClassName="h-40 w-32 rounded-lg border border-ink-600 object-cover transition hover:border-ember"
                caption
              />
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-xl font-semibold uppercase">Past Check-Ins</h2>
          <div className="space-y-4">
            {history.map((c) => (
              <div key={c.id} className="rounded-xl border border-ink-600 bg-ink-700 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{new Date(c.date).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}</p>
                  <div className="flex gap-3 text-xs text-ash">
                    {c.weight != null && <span className="font-semibold text-bone">{c.weight} lbs</span>}
                    <span>Energy: {c.energyLevel}/10</span>
                    <span>Training: {c.trainingAdhere}/10</span>
                    <span>Nutrition: {c.nutritionAdhere}/10</span>
                  </div>
                </div>
                {c.photoUrl && (
                  <div className="mt-3">
                    <PhotoThumb src={c.photoUrl} dateLabel={fmtDay(c.date)} weight={c.weight} />
                  </div>
                )}
                {c.wins && <p className="mt-2 text-sm"><span className="text-green-400">✓ Win:</span> {c.wins}</p>}
                {c.struggles && <p className="mt-1 text-sm"><span className="text-ember">↑ Struggle:</span> {c.struggles}</p>}
                {c.trainerReply && (
                  <div className="mt-3 rounded-lg border border-ember/30 bg-ember/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ember">Boston's Reply</p>
                    <p className="mt-1 text-sm">{c.trainerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
