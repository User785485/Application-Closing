import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Ce middleware s'exécute pour toutes les requêtes
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Ajouter des headers de sécurité
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Ajouter header de performance
  response.headers.set('X-Middleware-Timing', new Date().toISOString());
  
  // Log les requêtes en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);
  }
  
  return response;
}

// Spécifier les chemins où s'applique le middleware
export const config = {
  matcher: [
    // Appliquer à tous les chemins sauf quelques exceptions
    '/((?!_next/static|_next/image|favicon.ico|.*\.svg).*)',
  ],
};
