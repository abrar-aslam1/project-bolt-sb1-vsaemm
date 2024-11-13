import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const rapidApiKey = request.headers.get('x-rapidapi-key');
  const rapidApiHost = request.headers.get('x-rapidapi-host');

  // Verify RapidAPI authentication
  if (!rapidApiKey || !rapidApiHost) {
    return NextResponse.json(
      { error: 'Unauthorized - Missing RapidAPI credentials' },
      { status: 401 }
    );
  }

  // Verify against environment variables
  if (
    rapidApiHost !== process.env.NEXT_PUBLIC_RAPIDAPI_HOST ||
    rapidApiKey !== process.env.NEXT_PUBLIC_RAPIDAPI_KEY
  ) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid RapidAPI credentials' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};