import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'menu', component: MenuComponent }
];