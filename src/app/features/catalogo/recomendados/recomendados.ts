import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { PublicacionResponse } from '../../../core/models/publicacion.models';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { TarjetaPublicacion } from '../../../shared/tarjeta-publicacion/tarjeta-publicacion';

/**
 * Funcionalidad propia "Recomendados para tu mascota": el backend mira para que especie compra mas
 * el comprador y le recomienda productos de esa especie que todavia no ha comprado.
 */
@Component({
  selector: 'app-recomendados',
  imports: [TarjetaPublicacion],
  template: `
    <section class="p-3 p-md-4 mb-4 rounded-3 bg-success-subtle">
      <h2 class="h5 mb-1">🐾 Recomendados para tu mascota</h2>
      <p class="small text-body-secondary mb-3">Según lo que más compras, y que todavía no tienes.</p>

      @if (recomendadas(); as lista) {
        @if (lista.length === 0) {
          <p class="mb-0">Cuando hagas tu primera compra te recomendaremos productos para tu mascota.</p>
        } @else {
          <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
            @for (publicacion of lista; track publicacion.id) {
              <div class="col"><app-tarjeta-publicacion [publicacion]="publicacion" /></div>
            }
          </div>
        }
      } @else {
        <div class="spinner-border spinner-border-sm text-success" role="status"></div>
      }
    </section>
  `,
})
export class Recomendados {
  protected readonly recomendadas = toSignal(
    inject(PublicacionesService)
      .recomendadas()
      .pipe(catchError(() => of([] as PublicacionResponse[]))),
  );
}
