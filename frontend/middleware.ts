import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        // Always allow NextAuth endpoints + public pages
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname.startsWith("/videos/") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // Allow public static files from /public (e.g. /next.svg)
        if (pathname.includes(".")) {
          return true;
        }

        // Allow public feed read
        if (pathname.startsWith("/api/video") && req.method === "GET") {
          return true;
        }

        // Everything else requires auth
        return !!token;
      },
    },
  }
);

// Do not run auth middleware for Next internals / public assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
