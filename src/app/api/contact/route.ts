import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // TODO: integrate email/CRM delivery (e.g. Resend, or store as a lead).
  console.log("New contact enquiry:", body);
  return NextResponse.json({ ok: true });
}
