import { Component, inject } from '@angular/core';

import { AvisosService } from '../../core/services/avisos.service';

/** Muestra los avisos del AvisosService abajo a la derecha (toasts de Bootstrap). */
@Component({
  selector: 'app-avisos',
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      @for (aviso of avisosService.avisos(); track aviso.id) {
        <div class="toast show align-items-center border-0" role="alert"
             [class.text-bg-success]="aviso.tipo === 'exito'"
             [class.text-bg-danger]="aviso.tipo === 'error'"
             [class.text-bg-primary]="aviso.tipo === 'info'">
          <div class="d-flex">
            <div class="toast-body">{{ aviso.texto }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Cerrar"
                    (click)="avisosService.cerrar(aviso.id)"></button>
          </div>
        </div>
      }
    </div>
  `,
})
export class Avisos {
  protected readonly avisosService = inject(AvisosService);
}
