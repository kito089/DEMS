import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';
import { InicioComponent } from './pages/inicio/inicioComponent';
import { CocinaComponent } from './pages/cocina/cocinaComponent';
import { MeseroComponent } from './pages/mesero/meseroComponent';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cocina', component: CocinaComponent },
  { path: 'mesero', component: MeseroComponent },
];