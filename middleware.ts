import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /api/places-search)
  const pathname = request.nextUrl.pathname;

  // If it's an API request
  if (pathname.startsWith('/api/')) {
    // Create a new URL for the Netlify function
    const url = new URL(pathname.replace('/api/', '/.netlify/functions/api/'), request.url);
    
    // Copy all other parts of the URL (search params, etc)
    url.search = request.nextUrl.search;
    
    // Return rewritten response
    return NextResponse.rewrite(url);
  }

  // For all other requests, continue with default behavior
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
