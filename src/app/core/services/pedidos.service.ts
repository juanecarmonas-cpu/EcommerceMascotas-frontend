import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PedidoResponse } from '../models/pedido.models';

/** Endpoints de /api/pedidos (solo para el rol COMPRADOR). */
@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pedidos`;

  /** Comprar: crea el pedido (BORRADOR) y enseguida lo confirma, que es cuando se descuenta el stock. */
  comprar(publicacionId: string, cantidad: number): Observable<PedidoResponse> {
    return this.http
      .post<PedidoResponse>(this.url, { lineas: [{ publicacionId, cantidad }] })
      .pipe(switchMap((pedido) => this.http.put<PedidoResponse>(`${this.url}/${pedido.pedidoId}/confirmar`, {})));
  }

  misPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.url);
  }
}
