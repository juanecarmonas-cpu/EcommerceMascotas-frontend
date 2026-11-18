/** Espejo de LoginRequest del backend: mismos nombres de campos. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Espejo de TokenResponse del backend (respuesta de POST /api/auth/login). */
export interface TokenResponse {
  token: string;
  tipo: string;
  expiraEn: string;
  email: string;
  rol: Rol;
}

export type Rol = 'COMPRADOR' | 'VENDEDOR';
