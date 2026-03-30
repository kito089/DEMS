import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';
import { RegistroPlatilloComponent } from './components/registro-platillo-component/registro-platillo-component';
import { InicioComponent } from './pages/inicio/inicioComponent';
import { CocinaComponent } from './pages/cocina/cocinaComponent';
import { MeseroComponent } from './pages/mesero/meseroComponent';
import { ReservacionesComponent } from './pages/reservacion/reservacionesComponent';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'registro-platillo', component: RegistroPlatilloComponent },
  { path: 'registro-platillo/:id', component: RegistroPlatilloComponent },
  { path: 'cocina', component: CocinaComponent },
  { path: 'mesero', component: MeseroComponent },
  { path: 'reservaciones',    component: ReservacionesComponent },
];