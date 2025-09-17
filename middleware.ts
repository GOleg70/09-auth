import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const sessionResponse = await checkSession();

        if (sessionResponse.status === 200) {
          const newAccessToken = sessionResponse.data.accessToken;
          const newRefreshToken = sessionResponse.data.refreshToken;

          const response = NextResponse.next();
          response.cookies.set('accessToken', newAccessToken, { path: '/' });
          response.cookies.set('refreshToken', newRefreshToken, { path: '/' });
          return response;
        }
      } catch {
        const response = NextResponse.redirect(
          new URL('/sign-in', request.url)
        );
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    }

    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
