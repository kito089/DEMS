import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';
import { RegistroPlatilloComponent } from './components/registro-platillo-component/registro-platillo-component';
import { InicioComponent } from './pages/inicio/inicioComponent';
import { CocinaComponent } from './pages/cocina/cocinaComponent';
import { MeseroComponent } from './pages/mesero/meseroComponent';
import { ReservacionesComponent } from './pages/reservacion/reservacionesComponent';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadoresComponent';
import { RegistroTrabajadorComponent } from './components/registro-trabajador-component/registro-trabajador-component';
import { ReportesComponent } from './pages/reportes/reportesComponent';

export const routes: Routes = [
  { path: '',      component: LoginComponent, canActivate: [loginGuard] }, // 👈
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, // 👈
  { path: 'inicio',                  component: InicioComponent,             canActivate: [authGuard] },
  { path: 'menu',                    component: MenuComponent,               canActivate: [authGuard] },
  { path: 'registro-platillo',       component: RegistroPlatilloComponent,   canActivate: [authGuard] },
  { path: 'registro-platillo/:id',   component: RegistroPlatilloComponent,   canActivate: [authGuard] },
  { path: 'cocina',                  component: CocinaComponent,             canActivate: [authGuard] },
  { path: 'mesero',                  component: MeseroComponent,             canActivate: [authGuard] },
  { path: 'reservaciones',           component: ReservacionesComponent,      canActivate: [authGuard] },
  { path: 'trabajadores',            component: TrabajadoresComponent,       canActivate: [authGuard] },
  { path: 'registro-trabajador',     component: RegistroTrabajadorComponent, canActivate: [authGuard] },
  { path: 'registro-trabajador/:id', component: RegistroTrabajadorComponent, canActivate: [authGuard] },
  { path: 'reportes',                component: ReportesComponent,           canActivate: [authGuard] },
];