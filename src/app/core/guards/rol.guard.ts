import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Rol } from '../models/auth.models';
import { AuthService } from '../services/auth.service';
import { AvisosService } from '../services/avisos.service';

/**
 * Extra "Guard por rol": la ruta solo se abre si el rol del usuario coincide.
 * Se usa despues de sesionGuard, por ejemplo rolGuard('VENDEDOR') para publicar productos.
 */
export function rolGuard(rolPermitido: Rol): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    if (auth.rol() === rolPermitido) {
      return true;
    }
    inject(AvisosService).info('Esa opción no está disponible para tu rol.');
    return inject(Router).createUrlTree(['/catalogo']);
  };
}
