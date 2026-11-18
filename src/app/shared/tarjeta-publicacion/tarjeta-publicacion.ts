import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicacionResponse } from '../../core/models/publicacion.models';
import { AuthService } from '../../core/services/auth.service';

/** Tarjeta de un producto. Se reutiliza en el catalogo y en los recomendados. */
@Component({
  selector: 'app-tarjeta-publicacion',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './tarjeta-publicacion.html',
})
export class TarjetaPublicacion {
  readonly publicacion = input.required<PublicacionResponse>();
  protected readonly auth = inject(AuthService);
}
