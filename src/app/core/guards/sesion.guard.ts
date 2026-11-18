import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas que necesitan sesion: si alguien escribe la direccion sin haber iniciado sesion, va al login.
 * Es una comodidad para el usuario: la seguridad real la pone el backend, que revisa el token en cada peticion.
 */
export const sesionGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.haySesion() ? true : inject(Router).createUrlTree(['/login']);
};
