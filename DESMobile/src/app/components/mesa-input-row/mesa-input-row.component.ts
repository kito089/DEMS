import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesa-input-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesa-input-row.component.html',
  styleUrls: ['./mesa-input-row.component.scss'],
})
export class MesaInputRowComponent {
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) trailingIconSrc!: string;
}
