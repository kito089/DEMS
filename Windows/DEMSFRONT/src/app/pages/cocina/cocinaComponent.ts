import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cocina.html',
  styleUrls: ['./cocina.css'],
})
export class CocinaComponent implements OnInit {
  userName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    const rol = this.authService.getRol();

    // Validar que sea de cocina
    if (rol !== 'Cocina') {
      this.router.navigate(['/login']);
      return;
    }

    if (user) {
      this.userName = user.Nombre;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
