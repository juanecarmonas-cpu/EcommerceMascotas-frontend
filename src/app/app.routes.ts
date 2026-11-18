import { Routes } from '@angular/router';

import { invitadoGuard } from './core/guards/invitado.guard';
import { rolGuard } from './core/guards/rol.guard';
import { sesionGuard } from './core/guards/sesion.guard';
import { Login } from './features/auth/login/login';
import { Catalogo } from './features/catalogo/catalogo';
import { Comprar } from './features/pedidos/comprar/comprar';
import { MisPedidos } from './features/pedidos/mis-pedidos/mis-pedidos';
import { Publicar } from './features/publicaciones/publicar/publicar';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: 'catalogo', component: Catalogo, title: 'Catálogo · EcommerceMascotas' },
  { path: 'login', component: Login, canActivate: [invitadoGuard], title: 'Iniciar sesión · EcommerceMascotas' },
  // rutas privadas: primero se pide sesion y luego el rol
  {
    path: 'comprar/:id',
    component: Comprar,
    canActivate: [sesionGuard, rolGuard('COMPRADOR')],
    title: 'Comprar · EcommerceMascotas',
  },
  {
    path: 'mis-pedidos',
    component: MisPedidos,
    canActivate: [sesionGuard, rolGuard('COMPRADOR')],
    title: 'Mis pedidos · EcommerceMascotas',
  },
  {
    path: 'publicar',
    component: Publicar,
    canActivate: [sesionGuard, rolGuard('VENDEDOR')],
    title: 'Publicar producto · EcommerceMascotas',
  },
  { path: '**', redirectTo: 'catalogo' },
];
