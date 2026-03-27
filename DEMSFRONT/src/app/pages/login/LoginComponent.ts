import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/buttonComponent';
import { InputComponent } from '../../components/input/inputComponent';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layoutComponent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, InputComponent, AuthLayoutComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  constructor(private router: Router) {}

  onInicio() {
    this.router.navigate(['/inicio']);
  }
}