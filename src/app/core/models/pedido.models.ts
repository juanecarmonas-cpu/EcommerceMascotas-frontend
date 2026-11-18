/** Espejo de PedidoResponse del backend. */
export interface PedidoResponse {
  pedidoId: string;
  compradorId: string;
  estado: 'BORRADOR' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  montoTotal: number;
  moneda: string;
  lineas: LineaResponse[];
}

/** Espejo de PedidoResponse.LineaResponse. */
export interface LineaResponse {
  publicacionId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/** Espejo de CrearPedidoRequest (body de POST /api/pedidos). El comprador sale del token. */
export interface CrearPedidoRequest {
  lineas: LineaPedidoRequest[];
}

export interface LineaPedidoRequest {
  publicacionId: string;
  cantidad: number;
}
