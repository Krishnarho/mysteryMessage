import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig); // Done see auth.config.ts

export async function middleware(request: NextRequest) {
    //const token = await getToken({ req: request }); // Dont use this function instead use universal auth() as per Auth docs.
    const session = await auth();
    //console.log("middleware:: ", session);
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
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
}