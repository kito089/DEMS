import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup/setup.page').then(m => m.SetupPage),
  },
  {
    path: 'new-pedido',
    loadComponent: () => import('./pages/agr-ed-pedido/agr-ed-pedido.page').then((m) => m.AgrEdPedidoPage),
  },
  {
    path: 'agr-ed-pedido',
    loadComponent: () => import('./pages/agr-ed-pedido/agr-ed-pedido.page').then( m => m.AgrEdPedidoPage)
  },
  {
    path: 'cobrar-pedido',
    loadComponent: () => import('./pages/cobrar-pedido/cobrar-pedido.page').then( m => m.CobrarPedidoPage)
  },
  {
    path: 'reservaciones',
    loadComponent: () => import('./pages/reservaciones/reservaciones.page').then( m => m.ReservacionesPage)
  },
  {
    path: 'editar-pedidos',
    loadComponent: () => import('./pages/editar-pedidos/editar-pedidos.page').then( m => m.EditarPedidosPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'pedidos-acobrar',
    loadComponent: () => import('./pages/pedidos-acobrar/pedidos-acobrar.page').then( m => m.PedidosACobrarPage)
  },
  {
    path: 'pedidos-acobrar',
    loadComponent: () => import('./pages/pedidos-acobrar/pedidos-acobrar.page').then( m => m.PedidosACobrarPage)
  }

];