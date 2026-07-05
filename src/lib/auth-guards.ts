import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireActiveClientPage() {
  const session = await requireSession();
  if (session.user.role === "trainer") {
    redirect("/coach");
  }
  if (!session.user.hasPaid) {
    redirect("/application-status");
  }
  return session;
}

export async function requireTrainerPage() {
  const session = await requireSession();
  if (session.user.role !== "trainer") {
    redirect("/login");
  }
  return session;
}

export async function requireActiveClientApi() {
  const session = await auth();
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "client" || !session.user.hasPaid) {
    return { response: NextResponse.json({ error: "Account not active yet" }, { status: 403 }) };
  }
  return { session };
}

export async function requireTrainerApi() {
  const session = await auth();
  if (!session || session.user.role !== "trainer") {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}
