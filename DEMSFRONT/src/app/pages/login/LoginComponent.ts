import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/buttonComponent';
import { InputComponent } from '../../components/input/inputComponent';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layoutComponent';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, InputComponent, AuthLayoutComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {}