import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AvisosService } from '../services/avisos.service';

/**
 * Se escribe una sola vez y pasa por TODAS las peticiones:
 * 1. Si hay token, agrega el encabezado "Authorization: Bearer <token>".
 * 2. Si el backend responde 401 (token vencido o alterado), cierra la sesion, avisa y manda al login.
 * Ningun servicio ni componente escribe el encabezado a mano.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const avisos = inject(AvisosService);
  const router = inject(Router);

  const token = auth.tokenGuardado();
  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // un 401 en el login es "correo o contrasena incorrectos": eso lo maneja la pantalla de login
      const esElLogin = req.url.endsWith('/auth/login');
      if (error.status === 401 && !esElLogin) {
        auth.cerrarSesion();
        avisos.error('Tu sesión venció. Inicia sesión de nuevo.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
