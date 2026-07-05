import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import type { NextRequest } from "next/server";

// Next.js 16 renamed the `middleware` file convention to `proxy`, and the
// file must export a statically-analyzable function — so we wrap NextAuth's
// auth handler in an explicit function declaration.
const { auth } = NextAuth(authConfig);
type ProxyHandler = (request: NextRequest, event?: unknown) => Promise<Response | undefined>;
const handler = auth as unknown as ProxyHandler;

export default function proxy(request: NextRequest, event?: unknown) {
  return handler(request, event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/coach/:path*", "/login", "/signup"],
};
