import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "node:path/win32";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        )
          return true;

          if(pathname==="/" || pathname.startsWith("/api/videps")){
            return true;
          }

          return !!token
      },
    },
  }
);
