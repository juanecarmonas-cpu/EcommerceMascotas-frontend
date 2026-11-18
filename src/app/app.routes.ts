import { Routes } from '@angular/router';

import { invitadoGuard } from './core/guards/invitado.guard';
import { Login } from './features/auth/login/login';

// El catalogo y las rutas privadas se agregan en feature/catalogo y feature/compra-publicar.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, canActivate: [invitadoGuard], title: 'Iniciar sesión · EcommerceMascotas' },
];
