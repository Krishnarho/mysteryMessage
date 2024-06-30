import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig); // Check

export async function middleware(request: NextRequest) {
    //const token = await getToken({ req: request }); // TODO, check why getToken is giving problem.
    const session = await auth();
    console.log(session);
    const url = request.nextUrl;

    if (session && (
        url.pathname.startsWith('/sign-in')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!session && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/sign-in', '/dashboard/:path*'
    ]
}