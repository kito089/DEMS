import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-header-home',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons],
  templateUrl: './page-header-home.component.html',
  styleUrls: ['./page-header-home.component.scss'],
})
export class PageHeaderHomeComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) badgeText!: string;
}
