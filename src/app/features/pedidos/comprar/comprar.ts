import { DecimalPipe, formatNumber } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { mensajeDeError } from '../../../core/models/error.models';
import { PublicacionResponse } from '../../../core/models/publicacion.models';
import { AvisosService } from '../../../core/services/avisos.service';
import { PedidosService } from '../../../core/services/pedidos.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';

/** Operacion de negocio del comprador: comprar un producto (POST protegido con token). */
@Component({
  selector: 'app-comprar',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './comprar.html',
})
export class Comprar implements OnInit {
  /** El id llega de la ruta /comprar/:id (withComponentInputBinding). */
  readonly id = input.required<string>();

  private readonly publicaciones = inject(PublicacionesService);
  private readonly pedidos = inject(PedidosService);
  private readonly avisos = inject(AvisosService);
  private readonly router = inject(Router);
  private readonly locale = inject(LOCALE_ID);

  protected readonly publicacion = signal<PublicacionResponse | null>(null);
  protected readonly enviando = signal(false);

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.publicaciones.obtener(this.id()).subscribe({
      next: (publicacion) => this.publicacion.set(publicacion),
      error: (error: HttpErrorResponse) => {
        this.avisos.error(mensajeDeError(error));
        this.router.navigate(['/catalogo']);
      },
    });
  }

  protected comprar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.pedidos.comprar(this.id(), this.formulario.getRawValue().cantidad).subscribe({
      next: (pedido) => {
        const total = formatNumber(pedido.montoTotal, this.locale, '1.0-0');
        this.avisos.exito(`¡Compra confirmada! Total: $ ${total}`);
        this.router.navigate(['/mis-pedidos']);
      },
      error: (error: HttpErrorResponse) => {
        this.enviando.set(false);
        // el 401 ya lo avisa el interceptor
        if (error.status !== 401) {
          this.avisos.error(mensajeDeError(error));
        }
      },
    });
  }
}
