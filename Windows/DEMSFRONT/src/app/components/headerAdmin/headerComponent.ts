import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  @Input() title: string = '';
  rol: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.rol = this.authService.getRol();
  }

  logout() {
    this.authService.logout();
  }
}