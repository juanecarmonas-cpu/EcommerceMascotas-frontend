import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { PedidoResponse } from '../../../core/models/pedido.models';
import { PedidosService } from '../../../core/services/pedidos.service';

/** Ruta privada del comprador: sus pedidos, que salen de GET /api/pedidos con su token. */
@Component({
  selector: 'app-mis-pedidos',
  imports: [DecimalPipe, SlicePipe],
  templateUrl: './mis-pedidos.html',
})
export class MisPedidos {
  protected readonly pedidos = toSignal(
    inject(PedidosService)
      .misPedidos()
      .pipe(catchError(() => of([] as PedidoResponse[]))),
  );

  protected unidades(pedido: PedidoResponse): number {
    return pedido.lineas.reduce((total, linea) => total + linea.cantidad, 0);
  }
}
