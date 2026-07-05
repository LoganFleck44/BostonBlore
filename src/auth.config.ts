import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config — no database imports, used by middleware only.
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.hasPaid = (user as { hasPaid?: boolean }).hasPaid;
        token.engagementStatus = (user as { engagementStatus?: string }).engagementStatus;
        token.planInterest = (user as { planInterest?: string | null }).planInterest;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { hasPaid?: boolean }).hasPaid = Boolean(token.hasPaid);
        (session.user as { engagementStatus?: string }).engagementStatus =
          (token.engagementStatus as string | undefined) ?? "pending";
        (session.user as { planInterest?: string | null }).planInterest =
          (token.planInterest as string | null | undefined) ?? null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string })?.role;
      const hasPaid = Boolean((auth?.user as { hasPaid?: boolean })?.hasPaid);
      const engagementStatus =
        (auth?.user as { engagementStatus?: string })?.engagementStatus ?? "pending";
      const { pathname } = nextUrl;

      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn && role !== "trainer" && hasPaid && engagementStatus === "active";
      }
      if (pathname === "/application-status") {
        return isLoggedIn && role !== "trainer";
      }
      if (pathname.startsWith("/coach")) {
        return isLoggedIn && role === "trainer";
      }
      if (
        (pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/forgot-password" ||
          pathname === "/reset-password") &&
        isLoggedIn
      ) {
        const dest =
          role === "trainer"
            ? "/coach"
            : hasPaid && engagementStatus === "active"
              ? "/dashboard"
              : "/application-status";
        return Response.redirect(new URL(dest, nextUrl));
      }
      return true;
    },
  },
};
