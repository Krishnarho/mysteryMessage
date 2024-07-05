import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
//import { PUBLIC_ROUTES, LOGIN, ROOT, PROTECTED_SUB_ROUTES } from '@/routes'

const { auth } = NextAuth(authConfig); // Done see auth.config.ts

// export async function middleware(req: NextRequest) { // Tapas Logic check console
//     const { nextUrl } = req;
//     const session = await auth();
//     //return NextResponse.redirect(new URL("/"), request.url); // This just for understanding..

//     const isAuthenticated = !!session?.user;
//     console.log(isAuthenticated, nextUrl.pathname);

//     const isPublicRoute = ((PUBLIC_ROUTES.find(route => nextUrl.pathname.startsWith(route))
//         || nextUrl.pathname === ROOT) && !PROTECTED_SUB_ROUTES.find(route => nextUrl.pathname.includes(route)));

//     console.log(isPublicRoute);

//     if (!isAuthenticated && !isPublicRoute) {
//         return NextResponse.redirect(new URL(LOGIN, nextUrl))
//     }
// };

// export async function middleware(req: NextRequest) { //Antonio logic
//     const { nextUrl } = req;
//     const session = await auth();
//     console.log("middleware:: ", session);

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//     console.log(isApiAuthRoute, nextUrl.pathname)

//     if (isApiAuthRoute) { return null }

//     if (isAuthRoute) {
//         if (session) {
//             return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//         }
//         return null;
//     }

//     if (!session && !isPublicRoutes) {
//         return NextResponse.redirect(new URL('/sign-in', nextUrl))
//     }

//     return null;
// }

export async function middleware(request: NextRequest) { // Hitesh logic
    //const token = await getToken({ req: request }); // Dont use this function instead use universal auth() as per Auth docs.
    const session = await auth();
    //console.log("middleware:: ", session);
    const url = request.nextUrl;

    if (session &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!session && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
};

export const config = {
    //matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'], // chai aur code
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"] // Clerk
}