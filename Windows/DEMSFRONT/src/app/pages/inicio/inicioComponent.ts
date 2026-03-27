import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { ModuloCardComponent } from '../../components/card/cardComponent';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HeaderComponent, ModuloCardComponent],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {}
