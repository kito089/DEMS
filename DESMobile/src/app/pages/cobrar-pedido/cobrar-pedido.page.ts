import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { ElevatedPanelComponent } from '../../components/elevated-panel/elevated-panel.component';
import { TicketBrandHeaderComponent } from '../../components/ticket-brand-header/ticket-brand-header.component';
import { TicketLineRowComponent } from '../../components/ticket-line-row/ticket-line-row.component';
import { TicketTotalRowComponent } from '../../components/ticket-total-row/ticket-total-row.component';
import { DividerLineComponent } from '../../components/divider-line/divider-line.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';

@Component({
  selector: 'app-cobrar-pedido',
  templateUrl: './cobrar-pedido.page.html',
  styleUrls: ['./cobrar-pedido.page.scss'],
  standalone: true,
  imports: [
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

  constructor(private router: Router) {}

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

  noop(): void {}
}