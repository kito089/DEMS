import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  @Input({ required: true }) pedidosIconSrc!: string;
  @Input({ required: true }) reservacionesIconSrc!: string;
  @Input() pedidosLink = '/home';
  @Input() reservacionesLink = '/reservaciones';
}
