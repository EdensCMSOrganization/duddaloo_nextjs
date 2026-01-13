import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Definimos la ruta de login personalizada para el admin.
  // Al ser un boilerplate, esto se puede cambiar fácilmente por cliente.
  const adminLoginPath = "/admin/login";

  // Verificamos si la ruta actual pertenece al área de administración
  if (pathname.startsWith("/admin")) {
    // Aquí verificamos la autenticación.
    // Debes ajustar 'admin_session' al nombre real de tu cookie o token de sesión.
    const isAuthenticated = request.cookies.has("admin_session");

    // Caso 1: El usuario está intentando entrar a la página de login específica
    if (pathname === adminLoginPath) {
      // Si ya está autenticado, no tiene sentido que vea el login, lo mandamos al dashboard
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      // Si no está autenticado, permitimos que cargue la página de login
      return NextResponse.next();
    }

    // Caso 2: El usuario intenta entrar a cualquier otra página de admin (ej: /admin/dashboard)
    if (!isAuthenticated) {
      // Si no tiene sesión, lo redirigimos a nuestra URL de login personalizada
      return NextResponse.redirect(new URL(adminLoginPath, request.url));
    }
  }

  return NextResponse.next();
}

// Configuramos el matcher para optimizar el rendimiento y que solo se ejecute en rutas /admin
export const config = {
  matcher: "/admin/:path*",
};
