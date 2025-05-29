import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Permitir el acceso a la ruta
  } else {
    router.navigate(['/login']); // Redirigir a la página de inicio de sesión
    return false; // Bloquear el acceso a la ruta
  }
};