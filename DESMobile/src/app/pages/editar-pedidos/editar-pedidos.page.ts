import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-editar-pedidos',
  templateUrl: './editar-pedidos.page.html',
  styleUrls: ['./editar-pedidos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditarPedidosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
