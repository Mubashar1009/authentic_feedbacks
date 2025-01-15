import { NextRequest, NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Extract the token from the Authorization header
  // const token = await getToken({ req: request });
  // const url = request.nextUrl;
  // if (
  //   token &&
  //   (url.pathname.startsWith("/sign_in") ||
  //     url.pathname.startsWith("/sign_up") ||
  //     url.pathname.startsWith("/" || url.pathname.startsWith("/verify")))
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  // if (!token && url.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/sign_in", request.url));
  // }
  // return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/sign_in", "/sign_up", "/", "/dashboard/:path*", "/verify/:path*"],
};
