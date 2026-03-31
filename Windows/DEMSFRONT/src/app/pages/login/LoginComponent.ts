import { Component, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../components/button/buttonComponent';
import { InputComponent } from '../../components/input/inputComponent';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layoutComponent';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, InputComponent, AuthLayoutComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  @ViewChild('inputUsuario') inputUsuario!: InputComponent;
  @ViewChild('inputContraseña') inputContraseña!: InputComponent;

  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  async onLogin() {
    // Limpiar mensajes previos
    this.errorMessage = '';
    this.isLoading = true;

    // Obtener valores de los inputs
    const usuario = this.inputUsuario.getValue().trim();
    const contraseña = this.inputContraseña.getValue().trim();

    // Validaciones básicas
    if (!usuario || !contraseña) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña';
      this.isLoading = false;
      return;
    }

    try {
      // Llamar al servicio de autenticación
      const response = await this.authService
        .login(usuario, contraseña)
        .toPromise();

      if (response?.trabajador) {
        // Login exitoso, redirigir según rol
        const rol = response.trabajador.Rol;

        if (rol === 'Administrador') {
          this.router.navigate(['/inicio']);
        } else if (rol === 'Cocina') {
          // Asumiendo que existe una ruta /cocina
          this.router.navigate(['/cocina']);
        } else {
          this.router.navigate(['/menu']);
        }
      }
    } catch (error: any) {
      // Manejar errores de login
      const errorMsg =
        error?.error?.error || 'Error en el login, verifica tus credenciales';
      this.errorMessage = errorMsg;
      console.error('Error de login:', error);
    } finally {
      this.isLoading = false;
    }
  }
}