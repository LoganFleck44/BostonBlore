import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export default async function ApplicationStatusPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (session.user.role === "trainer") {
    redirect("/coach");
  }
  if (session.user.hasPaid && session.user.engagementStatus === "active") {
    redirect("/dashboard");
  }

  const isInactive = session.user.engagementStatus === "inactive";
  const eyebrow = isInactive ? "Coaching Paused" : "Application Received";
  const heading = isInactive ? "Your coaching is currently inactive" : "Your client access is pending";
  const body = isInactive
    ? "Your plan is currently paused, so the active dashboard is locked for now. Reach out to Boston whenever you're ready to resume and he can reactivate your account."
    : `Thanks for applying for ${session.user.planInterest || "coaching"}. Boston has your details and your dashboard will unlock after payment is confirmed manually.`;
  const footer = isInactive
    ? "If you want to restart coaching, send Boston a message and he can move you back to active."
    : "Already sent your e-transfer? Sign back in later to check whether your account has been activated.";

  return (
    <div className="min-h-screen bg-ink px-5 py-16 text-bone">
      <div className="mx-auto max-w-2xl rounded-3xl border border-ink-600 bg-ink-700 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase">
          {heading}
        </h1>
        <p className="mt-4 text-ash">{body}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-600 bg-ink-800 p-5">
            <p className="text-xs uppercase tracking-widest text-ash">Selected plan</p>
            <p className="mt-2 font-display text-2xl font-bold">
              {session.user.planInterest || "Application pending"}
            </p>
          </div>
          <div className="rounded-2xl border border-ink-600 bg-ink-800 p-5">
            <p className="text-xs uppercase tracking-widest text-ash">Need help?</p>
            <p className="mt-2 text-sm text-bone">
              Reach out to Boston at{" "}
              <a href={`mailto:${site.email}`} className="text-ember hover:underline">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" variant="outline" size="md">
            Contact Boston
          </ButtonLink>
          <ButtonLink href="/" size="md">
            Back to home
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-ash">
          {footer}
        </p>
        <p className="mt-3 text-sm text-ash">
          You can also{" "}
          <Link href="/login" className="text-ember hover:underline">
            return to login
          </Link>{" "}
          at any time.
        </p>
      </div>
    </div>
  );
}
