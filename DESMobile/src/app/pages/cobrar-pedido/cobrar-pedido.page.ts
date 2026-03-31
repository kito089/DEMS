import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { ElevatedPanelComponent } from '../../components/elevated-panel/elevated-panel.component';
import { TicketBrandHeaderComponent } from '../../components/ticket-brand-header/ticket-brand-header.component';
import { TicketLineRowComponent } from '../../components/ticket-line-row/ticket-line-row.component';
import { TicketTotalRowComponent } from '../../components/ticket-total-row/ticket-total-row.component';
import { DividerLineComponent } from '../../components/divider-line/divider-line.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { DividirPagosComponent } from 'src/app/layout/dividir-pagos/dividir-pagos.component';
import { EnviarTicketComponent } from 'src/app/layout/enviar-ticket/enviar-ticket.component';

@Component({
  selector: 'app-cobrar-pedido',
  templateUrl: './cobrar-pedido.page.html',
  styleUrls: ['./cobrar-pedido.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    IonContent,
    CommonModule,
    PageBodyComponent,
    PageHeaderCreamComponent,
    BottomNavComponent,
    ElevatedPanelComponent,
    TicketBrandHeaderComponent,
    TicketLineRowComponent,
    TicketTotalRowComponent,
    DividerLineComponent,
    PrimaryButtonComponent,
  ],
})
export class CobrarPedidoPage implements OnInit {

  pedido: any;
  total: number = 0;

  constructor(private router: Router, private modalCtrl: ModalController, private api: ApiService) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.pedido = nav?.extras?.state?.['pedido'];

    console.log('Pedido recibido:', this.pedido);

    if (this.pedido) {
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = this.pedido.items.reduce((acc: number, item: any) => {
      return acc + (item.PrecioUnitario || 0);
    }, 0);
  }

  getDescripcion(item: any): string {
    return `${item.Cantidad}x ${item.nombre}${item.Nota ? ' (' + item.Nota + ')' : ''}`;
  }

  async dividirPorPago() {
    const modal = await this.modalCtrl.create({
      component: DividirPagosComponent,
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,
      handle: true,
      componentProps: {
        total: this.total
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Pagos divididos:', JSON.stringify(data));
      // Aquí podrías actualizar la UI o enviar la información al backend
    }
  }

  async ModalTicket() {
    const modal = await this.modalCtrl.create({
      component: EnviarTicketComponent,
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,
      handle: true
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Ticket enviado a:', data);
      // Aquí podrías mostrar una confirmación o actualizar la UI
    }
  }

  noop(): void {}
}