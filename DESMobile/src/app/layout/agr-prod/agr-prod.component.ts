import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seleccionar-platillo',
  standalone: true,
  templateUrl: './agr-prod.component.html',
  styleUrls: ['./agr-prod.component.scss'],
  imports: [
    CommonModule,
    IonicModule
  ],
})
export class SeleccionarPlatilloComponent {

  constructor(private modalCtrl: ModalController) {}

  platillos = [
    { nombre: 'Enchiladas verdes', tipo: 'Alimento', precio: 105, img: 'https://via.placeholder.com/40' },
    { nombre: 'Pozole rojo', tipo: 'Alimento', precio: 120, img: 'https://via.placeholder.com/40' },
    { nombre: 'Agua de Jamaica', tipo: 'Bebida', precio: 30, img: 'https://via.placeholder.com/40' },
    { nombre: 'Tacos dorados', tipo: 'Alimento', precio: 80, img: 'https://via.placeholder.com/40' },
    { nombre: 'Coca Cola', tipo: 'Bebida', precio: 40, img: 'https://via.placeholder.com/40' },
  ];

  cerrar() {
    this.modalCtrl.dismiss();
  }
}