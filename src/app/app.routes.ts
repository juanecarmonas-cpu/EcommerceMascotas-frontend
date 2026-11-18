import { Routes } from '@angular/router';

import { invitadoGuard } from './core/guards/invitado.guard';
import { Login } from './features/auth/login/login';
import { Catalogo } from './features/catalogo/catalogo';

// Las rutas privadas (comprar, mis pedidos y publicar) se agregan en feature/compra-publicar.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: 'catalogo', component: Catalogo, title: 'Catálogo · EcommerceMascotas' },
  { path: 'login', component: Login, canActivate: [invitadoGuard], title: 'Iniciar sesión · EcommerceMascotas' },
  { path: '**', redirectTo: 'catalogo' },
];
