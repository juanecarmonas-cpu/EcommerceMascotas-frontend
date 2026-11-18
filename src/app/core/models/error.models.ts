import { HttpErrorResponse } from '@angular/common/http';

/** Espejo del JSON de error que arma GlobalExceptionHandler en el backend. */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  mensaje: string;
  errores?: Record<string, string>;
}

/**
 * Traduce el codigo HTTP a un mensaje que una persona entienda.
 * Si el backend mando su propio mensaje, se usa ese (por ejemplo, la regla de negocio que se rompio).
 */
export function mensajeDeError(error: HttpErrorResponse): string {
  const delBackend = (error.error as ErrorResponse | null)?.mensaje;
  switch (error.status) {
    case 0:
      return 'No hay conexión con el servidor. ¿Está corriendo el backend?';
    case 400:
      return `Revisa los datos. ${delBackend ?? ''}`.trim();
    case 401:
      return 'Inicia sesión para continuar.';
    case 403:
      return 'Tu rol no tiene permiso para esta operación.';
    case 404:
      return delBackend ?? 'No existe lo que buscas.';
    case 409:
    case 422:
      return delBackend ?? 'No se pudo hacer la operación.';
    default:
      return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
