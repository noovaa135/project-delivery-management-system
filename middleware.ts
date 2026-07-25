import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { isProtectedPath } from "@/server/auth/authorization";

const cookieName = process.env.NODE_ENV === "production"
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      cookieName,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (!token) {
      const signInUrl = new URL("/sign-in", request.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
