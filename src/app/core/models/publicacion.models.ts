/** Espejo de PublicacionResponse del backend. */
export interface PublicacionResponse {
  id: string;
  vendedorId: string;
  nombreProducto: string;
  descripcion: string;
  especieDestino: EspecieDestino;
  categoria: CategoriaProducto;
  precio: number;
  moneda: string;
  stock: number;
  estado: 'PUBLICADA' | 'AGOTADA' | 'RETIRADA';
}

/** Espejo de PageResponse del backend: la pagina que arma la base de datos. */
export interface PageResponse<T> {
  contenido: T[];
  totalElementos: number;
  totalPaginas: number;
  pagina: number;
  tamano: number;
}

/** Espejo de CrearPublicacionRequest (body de POST /api/publicaciones). */
export interface CrearPublicacionRequest {
  nombreProducto: string;
  descripcion: string;
  especieDestino: EspecieDestino;
  montoPrecio: number;
  moneda: string;
  stockInicial: number;
  categoria: CategoriaProducto;
}

export type EspecieDestino = 'PERRO' | 'GATO';

export type CategoriaProducto = 'ALIMENTO' | 'JUGUETE' | 'ACCESORIO' | 'HIGIENE' | 'SALUD';

export const ESPECIES: EspecieDestino[] = ['PERRO', 'GATO'];

export const CATEGORIAS: CategoriaProducto[] = ['ALIMENTO', 'JUGUETE', 'ACCESORIO', 'HIGIENE', 'SALUD'];
