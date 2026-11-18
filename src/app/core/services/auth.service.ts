import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, Rol, TokenResponse } from '../models/auth.models';

const CLAVE_TOKEN = 'token';
const CLAVE_EMAIL = 'email';
const CLAVE_ROL = 'rol';

/**
 * Sesion del usuario. Guarda el token en localStorage y lo expone como senales (signals):
 * el menu y los guards leen estas senales, asi que cambian solos al iniciar o cerrar sesion.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly token = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  readonly email = signal<string | null>(localStorage.getItem(CLAVE_EMAIL));
  readonly rol = signal<Rol | null>(localStorage.getItem(CLAVE_ROL) as Rol | null);

  readonly haySesion = computed(() => this.token() !== null);
  readonly esComprador = computed(() => this.rol() === 'COMPRADOR');
  readonly esVendedor = computed(() => this.rol() === 'VENDEDOR');

  login(datos: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((respuesta) => {
        localStorage.setItem(CLAVE_TOKEN, respuesta.token);
        localStorage.setItem(CLAVE_EMAIL, respuesta.email);
        localStorage.setItem(CLAVE_ROL, respuesta.rol);
        this.token.set(respuesta.token);
        this.email.set(respuesta.email);
        this.rol.set(respuesta.rol);
      }),
    );
  }

  /** Borra el token: el menu vuelve a su estado inicial sin recargar la pagina. */
  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_EMAIL);
    localStorage.removeItem(CLAVE_ROL);
    this.token.set(null);
    this.email.set(null);
    this.rol.set(null);
  }

  /** El interceptor lee el token de localStorage en cada peticion. */
  tokenGuardado(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }
}
