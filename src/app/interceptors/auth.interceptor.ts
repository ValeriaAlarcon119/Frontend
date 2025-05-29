import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // No interceptar las rutas de autenticación
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si el token expiró, intentar refrescarlo
          if (req.url.includes('/auth/refresh')) {
            // Si ya estamos intentando refrescar el token, cerrar sesión
            authService.logout();
            return throwError(() => error);
          }

          // Intentar refrescar el token
          return authService.refreshToken().pipe(
            switchMap(response => {
              // Reintentar la petición original con el nuevo token
              const newRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${response.token}`)
              });
              return next(newRequest);
            }),
            catchError(refreshError => {
              // Si falla el refresh, cerrar sesión
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
