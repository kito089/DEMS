import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  public username = '';
  public password = '';
  public showPassword = false;

  constructor(private api: ApiService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
  }

  login() {
    if (!this.username || !this.password) {
      alert('Por favor completa usuario y contraseña.');
      return;
    }

    const payload = {
      Nombre: this.username,
      Contra: this.password
    };

    const jsonstrPayload = JSON.stringify(payload);
    console.log('Login payload:', jsonstrPayload);

    this.api.post('/trabajadores/login', payload).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', JSON.stringify(res));

        const trabajador = res.body?.trabajador;
        if (trabajador) {
          localStorage.setItem('trabajador', JSON.stringify(trabajador));
          console.log('Trabajador guardado en localStorage:', localStorage.getItem('trabajador'));
          alert('Login exitoso');

          this.router.navigate(['/home']);
        } else {
          alert('Error: no se recibió información del trabajador');
          console.warn('Respuesta inesperada:', res);
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        alert(err.error?.error || 'Error en login');
      }
    });
  }
}

