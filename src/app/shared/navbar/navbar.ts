import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { AvisosService } from '../../core/services/avisos.service';

/** Menu que cambia segun la sesion y el rol. En pantalla pequena se vuelve menu hamburguesa (Bootstrap). */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisosService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.avisos.info('Cerraste sesión.');
    this.router.navigate(['/catalogo']);
  }
}
