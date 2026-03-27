import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';
import { InicioComponent } from './pages/inicio/inicioComponent';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'inicio', component: InicioComponent},
  { path: 'menu', component: MenuComponent }
  
];