import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.html',
  styleUrls: ['./input.css'],
})
export class InputComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
}