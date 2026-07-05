import { NextResponse } from "next/server";

// Where enquiries are delivered. Overridable via env for flexibility.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "bostonblore@icloud.com";
// Must be a Resend-verified domain in production. `onboarding@resend.dev`
// works out of the box but only delivers to the Resend account owner.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Boston Blore Website <onboarding@resend.dev>";

function esc(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const name = String(body.name).slice(0, 200);
  const email = String(body.email).slice(0, 200);
  const goal = body.goal ? String(body.goal).slice(0, 200) : "—";
  const interest = body.interest ? String(body.interest).slice(0, 200) : "—";
  const message = body.message ? String(body.message).slice(0, 5000) : "—";

  const apiKey = process.env.RESEND_API_KEY;

  // No key configured (e.g. local dev) — log and succeed so the form still works.
  if (!apiKey) {
    console.log("New contact enquiry (email not configured):", { name, email, goal, interest, message });
    return NextResponse.json({ ok: true });
  }

  const html = `
    <h2>New coaching enquiry</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Primary goal:</strong> ${esc(goal)}</p>
    <p><strong>Interested in:</strong> ${esc(interest)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${esc(message)}</p>
  `;
  const text = `New coaching enquiry\n\nName: ${name}\nEmail: ${email}\nPrimary goal: ${goal}\nInterested in: ${interest}\n\nMessage:\n${message}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email, // reply goes straight to the enquirer
        subject: `New enquiry from ${name}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend send failed:", res.status, detail);
      return NextResponse.json({ error: "Could not send message" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Could not send message" }, { status: 502 });
  }
}
