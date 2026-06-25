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
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string })?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn;
      }
      if (pathname.startsWith("/coach")) {
        return isLoggedIn && role === "trainer";
      }
      if ((pathname === "/login" || pathname === "/signup") && isLoggedIn) {
        const dest = role === "trainer" ? "/coach" : "/dashboard";
        return Response.redirect(new URL(dest, nextUrl));
      }
      return true;
    },
  },
};
