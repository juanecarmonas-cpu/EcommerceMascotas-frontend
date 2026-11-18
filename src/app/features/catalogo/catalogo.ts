import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';

import { mensajeDeError } from '../../core/models/error.models';
import { ESPECIES } from '../../core/models/publicacion.models';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { TarjetaPublicacion } from '../../shared/tarjeta-publicacion/tarjeta-publicacion';

/** Productos por pagina. La pagina la arma el backend, no Angular. */
const TAMANO_PAGINA = 6;

@Component({
  selector: 'app-catalogo',
  imports: [TarjetaPublicacion],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private readonly publicaciones = inject(PublicacionesService);
  protected readonly especies = ESPECIES;

  // Filtros como senales (signals): cuando cambia una, Angular sabe que tiene que volver a pedir la pagina.
  protected readonly texto = signal('');
  protected readonly especie = signal('');
  protected readonly pagina = signal(0);

  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  // Extra "busqueda reactiva": espera 400 ms despues de la ultima tecla para no pedir en cada letra (debounce).
  private readonly textoConEspera = toSignal(
    toObservable(this.texto).pipe(debounceTime(400), distinctUntilChanged()),
    { initialValue: '' },
  );

  // Los filtros se combinan en una sola senal; cada vez que cambia, se le pide la pagina al backend.
  private readonly filtros = computed(() => ({
    texto: this.textoConEspera(),
    especie: this.especie(),
    pagina: this.pagina(),
  }));

  protected readonly resultado = toSignal(
    toObservable(this.filtros).pipe(
      tap(() => {
        this.cargando.set(true);
        this.error.set(null);
      }),
      switchMap((filtros) =>
        this.publicaciones.buscar(filtros.texto, filtros.especie, filtros.pagina, TAMANO_PAGINA).pipe(
          catchError((error: HttpErrorResponse) => {
            this.error.set(mensajeDeError(error));
            return of(null);
          }),
        ),
      ),
      tap(() => this.cargando.set(false)),
    ),
    { initialValue: null },
  );

  protected escribir(valor: string): void {
    this.texto.set(valor);
    this.pagina.set(0);
  }

  protected filtrarEspecie(valor: string): void {
    this.especie.set(valor);
    this.pagina.set(0);
  }

  protected anterior(): void {
    this.pagina.update((pagina) => pagina - 1);
  }

  protected siguiente(): void {
    this.pagina.update((pagina) => pagina + 1);
  }
}
