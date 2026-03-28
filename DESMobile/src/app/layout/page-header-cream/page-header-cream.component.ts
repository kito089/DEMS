import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header-cream',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header-cream.component.html',
  styleUrls: ['./page-header-cream.component.scss'],
})
export class PageHeaderCreamComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) imageSrc!: string;
  @Input() imageAlt = '';
}
