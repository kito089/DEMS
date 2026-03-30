import { Component, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../components/button/buttonComponent';
import { InputComponent } from '../../components/input/inputComponent';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layoutComponent';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, InputComponent, AuthLayoutComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  @ViewChild('inputUsuario') inputUsuario!: InputComponent;
  @ViewChild('inputContraseña') inputContraseña!: InputComponent;

  constructor(private api: ApiService, private router: Router) { }

  onLogin() {
    const usuario = this.inputUsuario.getValue().trim();
    const contraseña = this.inputContraseña.getValue().trim();

    if (!usuario || !contraseña) {
      alert('Por favor ingresa usuario y contraseña.');
      return;
    }

    const payload = {
      Nombre: usuario,
      Contra: contraseña
    };

    this.api.post('/trabajadores/login', payload).subscribe({
      next: (res: any) => {
        const trabajador = res.body?.trabajador;
        if (trabajador) {
          localStorage.setItem('trabajador', JSON.stringify(trabajador));
          alert('Login exitoso');

          this.router.navigate(['/home']);
        } else {
          alert('Error: no se recibió información del trabajador');
        }
      },
      error: (err) => {
        alert(err.error?.error || 'Error en login');
      }
    });
  }
}

