import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBodyComponent } from '../page-body/page-body.component';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dividir-pagos',
  templateUrl: './dividir-pagos.component.html',
  styleUrls: ['./dividir-pagos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBodyComponent,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton
  ]
})
export class DividirPagosComponent implements OnInit {
  selectedMethod = 'tarjeta';
  amount: number | null = null;

  constructor() {}

  ngOnInit() {}

  onAddPayment() {
    console.log('Agregar forma de pago:', this.selectedMethod, this.amount);
    // lógica para agregar la forma de pago a la lista de pagos
  }

  onConfirmPayments() {
    console.log('Confirmar pagos', this.selectedMethod, this.amount);
    // lógica para confirmar cobro
  }
}

