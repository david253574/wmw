import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Only protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      // admin:wme-admin-2026
      const [user, pwd] = atob(authValue).split(':');

      if (user === 'admin' && pwd === 'wme-admin-2026') {
        return NextResponse.next();
      }
    }
    
    // Unauthorized
    url.pathname = '/api/unauthorized';
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
