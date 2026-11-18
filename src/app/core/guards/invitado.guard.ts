import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/** Saca de /login a quien ya tiene sesion: lo manda al catalogo. */
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.haySesion() ? inject(Router).createUrlTree(['/catalogo']) : true;
};
