import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const user = req.cookies.get('user'); // Get the 'user' cookie (or any other relevant cookie)
    console.log()
    if (!user) {
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect if no user
    }

    // Check the requested path to determine if it's 'admin' or 'facility'
    const path = req.nextUrl.pathname; // Get the path of the requested URL

    if (path.includes('/admin/auth/signin')) {
        console.log('User is trying to access an admin route');
        // You can add custom logic for admin routes here
    } else if (path.includes('/facility/auth/signin')) {
        console.log('User is trying to access a facility route');
        // You can add custom logic for facility routes here
    }

    return NextResponse.next(); // Continue the request
}

export const config = {
    matcher: ['/admin/dashboard/[...path]', '/facility/dashboard/[...path]'],
};
