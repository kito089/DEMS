import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBodyComponent } from '../page-body/page-body.component';
import { IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-enviar-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBodyComponent, IonContent, IonItem, IonInput, IonButton],
  templateUrl: './enviar-ticket.component.html',
  styleUrls: ['./enviar-ticket.component.scss'],
})
export class EnviarTicketComponent implements OnInit {
  email = '';

  constructor() { }

  ngOnInit() {}

  onCancel() {
    this.email = '';
  }

  onSend() {
    console.log('Enviar ticket a', this.email);
    // implementar envío de ticket
  }
}

