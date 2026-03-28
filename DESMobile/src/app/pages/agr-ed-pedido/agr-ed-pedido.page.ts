import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-agr-ed-pedido',
  templateUrl: './agr-ed-pedido.page.html',
  styleUrls: ['./agr-ed-pedido.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AgrEdPedidoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
