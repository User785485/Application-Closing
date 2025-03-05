import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  
  // Initialisation du client Supabase avec contexte middleware
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Routes protégées nécessitant authentification
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/appointments', '/sessions', '/clients', '/resources', '/scripts'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Routes d'authentification (rediriger si déjà connecté)
  const authRoutes = ['/login', '/register', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Logique de redirection
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Ajouter des headers de sécurité
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Ajouter header de performance
  res.headers.set('X-Middleware-Timing', new Date().toISOString());
  
  // Log les requêtes en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${req.method} ${pathname} - Auth: ${session ? 'Authenticated' : 'Not authenticated'}`);
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes requérant authentification
     * Ignore les routes statiques (_next/*, favicon.ico, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
