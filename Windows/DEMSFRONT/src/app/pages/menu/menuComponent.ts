import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HeaderComponent],  
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent {}
