import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { mensajeDeError } from '../../../core/models/error.models';
import { CATEGORIAS, CategoriaProducto, ESPECIES, EspecieDestino } from '../../../core/models/publicacion.models';
import { AvisosService } from '../../../core/services/avisos.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';

/** Operacion de negocio del vendedor: publicar un producto (POST protegido; ruta solo para VENDEDOR). */
@Component({
  selector: 'app-publicar',
  imports: [ReactiveFormsModule],
  templateUrl: './publicar.html',
})
export class Publicar {
  private readonly publicaciones = inject(PublicacionesService);
  private readonly avisos = inject(AvisosService);
  private readonly router = inject(Router);

  protected readonly especies = ESPECIES;
  protected readonly categorias = CATEGORIAS;
  protected readonly enviando = signal(false);

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    nombreProducto: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    especieDestino: ['', Validators.required],
    categoria: ['', Validators.required],
    montoPrecio: [0, [Validators.required, Validators.min(1)]],
    stockInicial: [1, [Validators.required, Validators.min(1)]],
  });

  protected invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && control.touched;
  }

  protected publicar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const datos = this.formulario.getRawValue();
    this.enviando.set(true);
    this.publicaciones
      .crear({
        ...datos,
        especieDestino: datos.especieDestino as EspecieDestino,
        categoria: datos.categoria as CategoriaProducto,
        moneda: 'COP',
      })
      .subscribe({
        next: (publicacion) => {
          this.avisos.exito(`Publicaste "${publicacion.nombreProducto}".`);
          this.router.navigate(['/catalogo']);
        },
        error: (error: HttpErrorResponse) => {
          this.enviando.set(false);
          if (error.status !== 401) {
            this.avisos.error(mensajeDeError(error));
          }
        },
      });
  }
}
