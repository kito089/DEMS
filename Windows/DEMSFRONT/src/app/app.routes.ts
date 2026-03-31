import { Routes } from '@angular/router';
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
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'registro-platillo', component: RegistroPlatilloComponent },
  { path: 'registro-platillo/:id', component: RegistroPlatilloComponent },
  { path: 'cocina', component: CocinaComponent },
  { path: 'mesero', component: MeseroComponent },
  { path: 'reservaciones', component: ReservacionesComponent },
  { path: 'trabajadores', component: TrabajadoresComponent },
  { path: 'registro-trabajador', component: RegistroTrabajadorComponent },
  { path: 'registro-trabajador/:id', component: RegistroTrabajadorComponent },
  { path: 'reportes', component: ReportesComponent },
];