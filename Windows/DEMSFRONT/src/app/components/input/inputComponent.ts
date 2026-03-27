import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.html',
  styleUrls: ['./input.css']
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = 'text'; // 'text', 'password', 'email', etc.
  @Input() isPasswordToggle: boolean = false; // Nueva propiedad

  hide = true;

  togglePassword() {
    this.hide = !this.hide;
  }

  // Determina el tipo actual del input dinámicamente
  get inputType(): string {
    if (this.isPasswordToggle) {
      return this.hide ? 'password' : 'text';
    }
    return this.type;
  }
}