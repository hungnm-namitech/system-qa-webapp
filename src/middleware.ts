import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;
  const conditions = [
    { path: '/login', redirectTo: '/manage/manual' },
    { path: '/register', redirectTo: '/manage/manual' },
    { path: '/forgot-password', redirectTo: '/manage/manual' },
    { path: '/url-invalid', redirectTo: '/manage/manual' },
    { path: '/404', redirectTo: '/not-found' },
  ];
  if (
    !token &&
    !pathname.includes('/login') &&
    !pathname.includes('/register') &&
    !pathname.includes('/forgot-password') &&
    !pathname.includes('/url-invalid') &&
    !pathname.includes('/manual-preview') &&
    !pathname.includes('/search') &&
    !pathname.includes('/404')
  ) {
    const queryParams = getQueryParams(request.url);
    let urlLogin = '/login';
    if (queryParams.loginExtensions) {
      urlLogin = urlLogin + '?loginExtensions= true';
    }
    return NextResponse.redirect(new URL(urlLogin, request.url));
  }
  for (const condition of conditions) {
    if (token && pathname.startsWith(condition.path))
      return NextResponse.redirect(new URL(condition.redirectTo, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|ws$).*)'],
};

function getQueryParams(url: string): { [key: string]: string } {
  const params: { [key: string]: string } = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
