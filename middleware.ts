import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth token from cookie
  // const authToken = request.cookies.get('like_auth_token')?.value;
  
  // If token exists, add it as Authorization header to the request
  // Note: This logic is currently causing issues with Next.js 14.2.26 in production (TypeError: Cannot read properties of undefined (reading 'bind'))
  // Since our Server Components (like app/[slug]/page.tsx) read cookies directly via `cookies()`, this header injection might be redundant.
  // We are temporarily disabling it to resolve the runtime error.
  
  /*
  if (authToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  */
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

