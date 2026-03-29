import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';
import { InicioComponent } from './pages/inicio/inicioComponent';
import { PedidosCocinaComponent } from './pages/cocina/cocinaComponent';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'inicio', component: InicioComponent},
  {path: 'login', component: LoginComponent },
  {path: 'cocina', component: PedidosCocinaComponent },  
  { path: 'menu', component: MenuComponent }
];