import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CrearPublicacionRequest, PageResponse, PublicacionResponse } from '../models/publicacion.models';

/** Endpoints de /api/publicaciones. Los componentes no conocen la direccion: se la piden a este servicio. */
@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/publicaciones`;

  /** Catalogo: la busqueda y la paginacion las hace el backend; Angular solo pide una pagina. */
  buscar(texto: string, especie: string, pagina: number, tamano: number): Observable<PageResponse<PublicacionResponse>> {
    let params = new HttpParams().set('pagina', pagina).set('tamano', tamano);
    if (texto.trim()) {
      params = params.set('texto', texto.trim());
    }
    if (especie) {
      params = params.set('especie', especie);
    }
    return this.http.get<PageResponse<PublicacionResponse>>(this.url, { params });
  }

  obtener(id: string): Observable<PublicacionResponse> {
    return this.http.get<PublicacionResponse>(`${this.url}/${id}`);
  }

  /** Funcionalidad propia: recomendados para la mascota del comprador del token. */
  recomendadas(): Observable<PublicacionResponse[]> {
    return this.http.get<PublicacionResponse[]>(`${this.url}/recomendadas`);
  }

  crear(datos: CrearPublicacionRequest): Observable<PublicacionResponse> {
    return this.http.post<PublicacionResponse>(this.url, datos);
  }
}
