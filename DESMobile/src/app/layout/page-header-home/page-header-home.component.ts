import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header-home.component.html',
  styleUrls: ['./page-header-home.component.scss'],
})
export class PageHeaderHomeComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) badgeText!: string;
}
